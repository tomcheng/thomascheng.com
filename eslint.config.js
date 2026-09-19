import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  // vite.config.ts uses `__dirname`, a Node global absent from
  // globals.browser, and would otherwise risk a no-undef failure in CI.
  // scripts/ holds one-shot Node tooling with the same issue. Neither is
  // shipped to the browser, so both are out of scope for this app lint.
  { ignores: ["dist", "scripts", "*.config.js", "*.config.ts"] },
  // .superpowers/ is entirely gitignored (see .superpowers/sdd/.gitignore:
  // "*") planning/verification scaffolding with its own package.json and
  // node_modules (Playwright harness scripts), not part of the shipped
  // site. It predates this ESLint setup and was not accounted for in the
  // fixed ignore list above; without this it fails ~200 no-undef/
  // no-require-imports errors for plain Node/browser-eval globals
  // (window, document, require, console, process) that are correct in
  // that context. Kept as a separate global-ignore entry so the list
  // above stays exactly as specified.
  { ignores: [".superpowers"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-console": "error",
    },
  }
);
