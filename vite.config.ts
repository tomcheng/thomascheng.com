import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

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
      // React stays at 16.6.3 in this task, which predates the
      // `react/jsx-runtime` automatic-runtime module (added in React 17).
      // Use the classic runtime so output calls React.createElement,
      // matching what the CRA/Babel toolchain produced.
      return transformWithOxc(code, id, {
        lang: "jsx",
        jsx: { runtime: "classic" },
      });
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [jsxInJsFiles(), react({ jsxRuntime: "classic" })],
  build: { outDir: "dist" },
});
