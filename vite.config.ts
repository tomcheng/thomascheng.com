import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { ROUTES } from "./src/routes";

// GitHub Pages has no SPA rewrite rule, and respects the file it finds
// (or falls back to 404.html) for the HTTP status it returns. Every route
// in ROUTES gets its own real `<route>/index.html` -- a byte-identical copy
// of the built app shell -- so those known paths are served with a 200
// instead of everything, including real pages, coming back as a 404.
// 404.html (also a copy of the same shell) remains the fallback for
// genuinely unknown paths, which keeps the deep-link trick working for
// them while correctly reporting 404.
function spa404() {
  let dist = "";
  return {
    name: "spa-404",
    configResolved(config: { root: string; build: { outDir: string } }) {
      dist = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const shell = resolve(dist, "index.html");
      copyFileSync(shell, resolve(dist, "404.html"));
      for (const route of ROUTES) {
        if (route === "/") continue;
        const dir = resolve(dist, route.slice(1));
        mkdirSync(dir, { recursive: true });
        copyFileSync(shell, resolve(dir, "index.html"));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // @vitejs/plugin-react's own dev/prod decision for the JSX transform
  // (jsxDEV + embedded absolute file paths/line numbers vs the plain jsx/jsxs
  // runtime) is taken from `process.env.NODE_ENV` directly, read by Vite
  // itself while resolving `config.isProduction` -- independent of, and
  // earlier than, the `define` below. On this machine's shell
  // (NODE_ENV=development), that made `vite build` silently emit the dev JSX
  // runtime with this repo's local file paths baked into the bundle, even
  // though `mode` here already correctly reports "production". Mutating the
  // ambient var to match `mode` before Vite finishes resolving config fixes
  // both call sites at once. Needed only because Task 6 switched the JSX
  // runtime from classic (React.createElement, insensitive to NODE_ENV) to
  // automatic.
  process.env.NODE_ENV = mode;

  return {
    base: "/",
    plugins: [
      react(),
      spa404(),
      // Lossy re-compression only, at build time; source files in src/images
      // stay untouched in git. Quality kept high -- this is a design
      // portfolio and visible artifacts in the work samples would be a
      // regression, not a win.
      ViteImageOptimizer({
        jpg: { quality: 88 },
        jpeg: { quality: 88 },
        png: { quality: 90 },
      }),
    ],
    // Vite seeds the bundle's `process.env.NODE_ENV` from the ambient NODE_ENV
    // whenever one is set, so a shell exporting NODE_ENV=development makes
    // `vite build` emit React's development build. Under React 19 that is fatal,
    // not merely wasteful: styled-components v4's dev-only className check calls
    // ReactDOM.findDOMNode, which React 19 removed, so every styled component
    // throws on mount and the page renders blank. Pin the value to Vite's own
    // mode, which is "production" for `vite build` and "development" for `vite`.
    define: { "process.env.NODE_ENV": JSON.stringify(mode) },
    build: { outDir: "dist" },
  };
});
