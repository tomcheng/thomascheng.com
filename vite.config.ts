import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
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

const repoRoot = fileURLToPath(new URL(".", import.meta.url));

// experiments/ holds standalone sites that share this repo's tooling but not
// the portfolio's code or its domain (see experiments/README.md). SITE=<name>
// builds or serves that one experiment alone, with its folder as the site
// root; the output still lands in dist/, so every deployment of this repo is
// configured identically apart from that one variable.
function experimentConfig(site: string) {
  const root = resolve(repoRoot, "experiments", site);
  if (!existsSync(resolve(root, "index.html"))) {
    throw new Error(`SITE=${site}: no experiments/${site}/index.html`);
  }
  // An experiment that ships a web app manifest is installable, so it also
  // gets a service worker that keeps the whole site for offline use. The
  // manifest itself stays a plain file in the experiment's public/ folder.
  const installable = existsSync(resolve(root, "public/manifest.webmanifest"));
  return {
    root,
    base: "/",
    plugins: [
      react(),
      ...(installable
        ? [
            VitePWA({
              manifest: false,
              registerType: "autoUpdate",
              workbox: {
                globPatterns: [
                  "**/*.{html,js,css,woff2,png,svg,webmanifest}",
                ],
                // The physics engine's WebAssembly is inlined in the bundle.
                maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
              },
            }),
          ]
        : []),
    ],
    build: { outDir: resolve(repoRoot, "dist"), emptyOutDir: true },
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

  if (process.env.SITE) return experimentConfig(process.env.SITE);

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
    build: { outDir: "dist" },
  };
});
