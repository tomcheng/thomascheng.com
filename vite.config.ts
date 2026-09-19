import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// The 2018-era CRA codebase puts JSX in plain .js files (not .jsx).
// Rolldown-vite's native module graph parser only enables JSX grammar for
// .jsx/.tsx by extension, so a plain .transform hook in @vitejs/plugin-react
// never gets a chance to run for .js files containing JSX — the native
// parser rejects them first. This pre-pass explicitly reparses our own
// source .js files as JSX before Rolldown's own parse. Restricted to
// src/**/*.js so dependency and config files are untouched.
function jsxInJsFiles() {
  return {
    name: "jsx-in-js-files",
    enforce: "pre" as const,
    async transform(code: string, id: string) {
      if (!id.includes("/src/") || !id.endsWith(".js")) return null;
      // Use the classic runtime so output calls React.createElement,
      // matching what the CRA/Babel toolchain produced. React 19 also
      // supports the automatic runtime, but switching is a separate,
      // deliberately deferred change.
      return transformWithOxc(code, id, {
        lang: "jsx",
        jsx: { runtime: "classic" },
      });
    },
  };
}

// GitHub Pages has no SPA rewrite rule. Serving the app shell as the 404
// document makes a deep link like /design boot the app, which then routes
// client-side to the right page.
function spa404() {
  let dist = "";
  return {
    name: "spa-404",
    configResolved(config: { root: string; build: { outDir: string } }) {
      dist = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [jsxInJsFiles(), react({ jsxRuntime: "classic" }), spa404()],
  // Vite seeds the bundle's `process.env.NODE_ENV` from the ambient NODE_ENV
  // whenever one is set, so a shell exporting NODE_ENV=development makes
  // `vite build` emit React's development build. Under React 19 that is fatal,
  // not merely wasteful: styled-components v4's dev-only className check calls
  // ReactDOM.findDOMNode, which React 19 removed, so every styled component
  // throws on mount and the page renders blank. Pin the value to Vite's own
  // mode, which is "production" for `vite build` and "development" for `vite`.
  define: { "process.env.NODE_ENV": JSON.stringify(mode) },
  build: { outDir: "dist" },
}));
