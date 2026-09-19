import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { ROUTES, STANDALONE_ROUTES } from "./src/routes";

// GitHub Pages has no SPA rewrite rule, and respects the file it finds
// (or falls back to 404.html) for the HTTP status it returns. Every route
// in ROUTES and STANDALONE_ROUTES gets its own real `<route>/index.html` --
// a byte-identical copy of the built app shell -- so those known paths are served with a 200
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
      for (const route of [...ROUTES, ...STANDALONE_ROUTES]) {
        if (route === "/") continue;
        const dir = resolve(dist, route.slice(1));
        mkdirSync(dir, { recursive: true });
        copyFileSync(shell, resolve(dir, "index.html"));
      }
    },
  };
}

// The same app is also deployed on its own domain, letterfall.app, where it
// shows Letterfall at every path (see LETTERFALL_HOSTS in src/routes.ts).
// That deployment sets SITE=letterfall at build time so that what the HTML
// says about itself -- the tab title before the app mounts, and everything a
// link preview is built from -- is about Letterfall, not the portfolio.
function siteMeta() {
  const letterfall = {
    title: "Letterfall",
    description:
      "Hold a finger down and letters pour out from under it. Tap one to pop it.",
    url: "https://letterfall.app/",
  };
  return {
    name: "site-meta",
    transformIndexHtml(html: string) {
      if (process.env.SITE !== "letterfall") return html;
      const content = (value: string) => `content="${value}"`;
      return html
        .replace(/<title>[^<]*<\/title>/, `<title>${letterfall.title}</title>`)
        .replace(
          /(<meta name="description" )content="[^"]*"/,
          `$1${content(letterfall.description)}`
        )
        .replace(
          /(<meta property="og:url" )content="[^"]*"/,
          `$1${content(letterfall.url)}`
        )
        .replace(
          /(<meta property="og:title" )content="[^"]*"/,
          `$1${content(letterfall.title)}`
        )
        .replace(
          /(<meta property="og:description" )content="[^"]*"/,
          `$1${content(letterfall.description)}`
        );
    },
  };
}

export default defineConfig(({ mode }) => {
  // @vitejs/plugin-react reads `process.env.NODE_ENV` directly when choosing
  // its JSX transform: the dev `jsxDEV` runtime (which embeds absolute local
  // file paths and line numbers) vs the plain production `jsx`/`jsxs`
  // runtime. It does this independently of, and earlier than, Vite's own
  // `mode`-derived define for `process.env.NODE_ENV` in the returned config
  // below -- so setting the define alone does not affect this decision. On a
  // developer shell exporting NODE_ENV=development, that would otherwise make
  // `vite build` silently emit the dev JSX runtime -- with this machine's
  // local file paths baked into the production bundle -- even though `mode`
  // here correctly reports "production". Mutating the ambient var to match
  // `mode` before Vite/the plugin read it fixes that. Needed only because
  // Task 6 switched the JSX runtime from classic (React.createElement,
  // insensitive to NODE_ENV) to automatic.
  process.env.NODE_ENV = mode;

  return {
    base: "/",
    plugins: [
      react(),
      siteMeta(),
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
    build: { outDir: "dist" },
  };
});
