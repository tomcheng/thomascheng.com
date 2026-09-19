# thomascheng.com Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move a 2018-era Create React App portfolio from a build that no longer runs on modern Node to a current, maintained stack, without changing how the site looks or feels.

**Architecture:** Eleven sequential tasks on one branch, each ending in a working site and its own commit. One concern per task, so a regression can be bisected to a single upgrade. The riskiest change for *feel* (React's render batching) and the riskiest for *layout* (styled-components v6) are isolated from each other.

**Tech Stack:** Vite 8, React 19, react-router-dom 7, styled-components 6, TypeScript 6, ESLint 10 flat config, GitHub Actions → GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-19-modernization-design.md`

## Global Constraints

- **No test suite is committed.** The site owner chose manual verification. Every task's gate is a build/typecheck command plus a named browser check. Do not add Vitest, Playwright, or Jest.
- **Visual output must not change.** Any rendering difference from the Task 1 baseline is a regression to fix, not an improvement to keep. Two intentional exceptions: the `/resume` contact line (Task 3) and icon rendering (Task 7), which must still match in size, weight, and position.
- **Carousel feel is the highest-value thing being preserved.** `Carousel.js` gets exactly three *behavior-affecting* edits — Tasks 3, 4, and 5 — and no refactor. Tasks 6 and 7 also touch the file, but only non-behaviorally (type annotations; swapping the `ReturnIndicator` element from `<i>` to `<Icon>`). Any change to its easing curves, durations, drag constants, or pane arithmetic is out of scope in every task. See the spec's *Note on `Carousel.js`*.
- Pinned versions: `vite@8.3.0`, `@vitejs/plugin-react@6.1.1`, `react@19.3.0`, `react-dom@19.3.0`, `react-router-dom@7.18.4`, `styled-components@6.5.3`, `typescript@6.0.3`, `eslint@10.11.0`, `typescript-eslint@8.70.0`, `prettier@3.9.8`.
- **TypeScript is pinned to 6.0.3, not the latest 7.0.2.** `typescript-eslint@8.70.0` declares `peerDependencies.typescript: ">=4.8.4 <6.1.0"`, and no released `typescript-eslint` supports TS 7. Typed linting on a small codebase is worth more than being one major ahead. Revisit when `typescript-eslint` ships TS 7 support.
- Node 22 (`.nvmrc`). The CNAME `thomascheng.com` must survive into every build.
- Do not reformat files you are not otherwise changing. Prettier arrives in Task 10; a repo-wide reformat before then buries real diffs.

### Why React and the router upgrade together

React 19 removes legacy context (`contextTypes` / `childContextTypes`) and the unprefixed `componentWillMount` / `componentWillReceiveProps`. `react-router` 4.3.1 uses all three — `node_modules/react-router/Router.js:72,92,113,116` and `Route.js:90,98,147,154` — and legacy context is *how* it passes location down, so it breaks rather than warns. react-router 7 in turn requires React 18+. Neither can move first. They are one commit, and that commit is the largest in this plan. Do not try to split it.

---

## File Structure

**Created:**
| Path | Responsibility |
|---|---|
| `vite.config.ts` | Build config: React plugin, output dir, `404.html` emit, image optimization |
| `index.html` | App shell; moves from `public/` to repo root (Vite requirement) |
| `tsconfig.json`, `tsconfig.node.json` | Compiler config for app and for build tooling |
| `src/vite-env.d.ts` | Ambient types for Vite's image/CSS imports |
| `src/components/common/Icon.tsx` | The six inline SVG icons replacing Font Awesome |
| `src/types/piece.ts` | The `Piece` discriminated union shared by the route handlers |
| `scripts/codemod-image-requires.mjs` | One-shot: rewrites 76 `require()` calls to ESM imports |
| `scripts/generate-icons.mjs` | One-shot: extracts real glyph paths from the vendored font |
| `eslint.config.js`, `.prettierrc` | Lint and format config |
| `.github/workflows/deploy.yml` | Build and deploy to Pages on push to `master` |
| `public/robots.txt` | Disallows `/resume` |

**Deleted:** `src/styles/font-awesome.css` (1,793 lines), `src/fonts/` (6 files, ~4 MB), `.eslintrc`, `public/index.html`.

**Modified:** `package.json`, `.gitignore`, `.nvmrc`, and the 30 files under `src/` (all renamed to `.ts`/`.tsx` in Task 6).

---

### Task 1: Branch, lockfile, and reference baseline

Nothing here changes the site. It creates the thing every later task is checked against. Do not skip it — without the baseline, "looks the same" is unverifiable.

**Files:**
- Commit: `package-lock.json` (currently untracked)

(`.gitignore` is not touched here — that happens in Task 2 Step 10.)

- [ ] **Step 1: Create the working branch**

```bash
git checkout -b modernize
```

- [ ] **Step 2: Commit the lockfile**

It has never been committed, so builds are not reproducible.

```bash
git add package-lock.json
git commit -m "chore: commit lockfile for reproducible installs"
```

- [ ] **Step 3: Build the reference site**

The legacy OpenSSL flag is required — webpack 4 calls a hash OpenSSL 3 removed. Without it this fails with `ERR_OSSL_EVP_UNSUPPORTED`.

```bash
NODE_OPTIONS=--openssl-legacy-provider npx react-scripts build
```

Expected: `Compiled successfully.` and roughly `59.39 KB` + `45.85 KB` gzip JS chunks.

- [ ] **Step 4: Preserve the reference build outside the repo**

```bash
cp -R build /tmp/thomascheng-baseline
```

- [ ] **Step 5: Capture reference screenshots**

```bash
npx serve -s /tmp/thomascheng-baseline -l 5000
```

In a browser, visit each of `#/`, `#/games`, `#/apps`, `#/design`, `#/contact` at widths 375, 768, and 1440. Save 15 screenshots to `/tmp/thomascheng-baseline-shots/<route>-<width>.png`. These are working files — do **not** commit them.

- [ ] **Step 6: Record the carousel's current feel**

On `/design` at 1440px, in the first carousel ("Typography Booklet"): drag and release slowly; drag and release with a hard flick; drag past the left edge and let go; drag hard past the right edge. Note how each settles. This is the reference for Tasks 3, 4, and 5 — feel cannot be screenshotted.

- [ ] **Step 7: Confirm the bug this plan fixes in Task 5**

Still on `/design`: fling one carousel and, while it is gliding, immediately fling a different one. The first stops dead. Confirm you can reproduce it, so you can confirm it is gone in Task 5.

- [ ] **Step 8: Record the starting audit number**

```bash
npm audit | tail -3
```

Expected: 187 vulnerabilities. Note it for the final report.

---

### Task 2: Replace Create React App with Vite

The largest mechanical task. The 76 `require()` calls are webpack-only; `require` is not defined in a Vite module, so every one must become an ESM import. **React stays at 16.6 here** — do not upgrade it in this task.

**Files:**
- Create: `vite.config.ts`, `index.html`, `src/vite-env.d.ts`, `scripts/codemod-image-requires.mjs`
- Delete: `public/index.html`
- Modify: `package.json`, `.gitignore`, `.nvmrc`, `src/index.js`, and the 5 route handlers

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm run preview`. Build output moves from `build/` to `dist/`.

- [ ] **Step 1: Swap the dependencies**

```bash
npm uninstall react-scripts gh-pages
npm install -D vite@8.3.0 @vitejs/plugin-react@6.1.1
```

- [ ] **Step 2: Replace the scripts block in `package.json`**

Also delete the now-meaningless `homepage` field — Vite uses `base` instead.

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

- [ ] **Step 3: Write `vite.config.ts`**

`base: "/"` is correct because the site is served from an apex custom domain, not a project subpath.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: { outDir: "dist" },
});
```

- [ ] **Step 4: Move the app shell to the repo root**

```bash
git mv public/index.html index.html
```

- [ ] **Step 5: Add the module script tag to `index.html`**

Vite requires an explicit entry. Add as the last child of `<body>`, after `<div id="root">`:

```html
<script type="module" src="/src/index.js"></script>
```

- [ ] **Step 6: Add ambient types for asset imports**

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 7: Write the image-require codemod**

All 76 calls share one shape: `require("../../images/…")` used as a value. Create `scripts/codemod-image-requires.mjs`:

```js
import { readFileSync, writeFileSync } from "node:fs";

const files = process.argv.slice(2);

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const imports = [];
  const seen = new Map();

  const rewritten = source.replace(
    /require\((["'])([^"']+)\1\)/g,
    (_match, _quote, specifier) => {
      if (!seen.has(specifier)) {
        const name = `img${seen.size}`;
        seen.set(specifier, name);
        imports.push(`import ${name} from "${specifier}";`);
      }
      return seen.get(specifier);
    }
  );

  if (imports.length === 0) continue;

  // Insert generated imports directly after the final existing import.
  const lines = rewritten.split("\n");
  let lastImport = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^import\s/.test(lines[i])) lastImport = i;
  }
  lines.splice(lastImport + 1, 0, ...imports);

  writeFileSync(file, lines.join("\n"));
  console.log(`${file}: converted ${imports.length} imports`);
}
```

- [ ] **Step 8: Run the codemod**

```bash
node scripts/codemod-image-requires.mjs \
  src/components/route-handlers/AcademicWork.js \
  src/components/route-handlers/HomeMobile.js \
  src/components/route-handlers/HomeDesktop.js \
  src/components/route-handlers/Games.js \
  src/components/route-handlers/Apps.js
```

Expected — these counts are exact, because duplicate specifiers within a file collapse to one import:

```
AcademicWork.js: converted 28 imports
HomeMobile.js: converted 34 imports
HomeDesktop.js: converted 6 imports
Games.js: converted 7 imports
Apps.js: converted 1 imports
```

- [ ] **Step 9: Verify no `require()` remains**

```bash
grep -rn "require(" src --include="*.js"
```

Expected: no output. Convert anything left by hand — it will be `undefined` at runtime, not a build error.

- [ ] **Step 10: Update `.nvmrc` and `.gitignore`**

`.nvmrc` becomes exactly:

```
22
```

In `.gitignore`, replace the `build/` line with:

```
dist/
```

- [ ] **Step 11: Build and run**

```bash
npm run build && npm run preview
```

Expected: build succeeds with **no** `NODE_OPTIONS` flag. Confirm `cat dist/CNAME` → `thomascheng.com`.

- [ ] **Step 12: Verify against the baseline**

Visit all five routes at 375/768/1440 and compare to the Task 1 screenshots. **Pay closest attention to `/design` and `/` — they carry 62 of the 76 converted images.** Every image must render; a broken import shows as a missing image, not an error.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "build: replace Create React App with Vite 8

Converts 76 webpack require() calls for images to ESM imports.
The site now builds on Node 22 without --openssl-legacy-provider."
```

---

### Task 3: Upgrade React 19 and react-router 7

The largest and riskiest task. These cannot be split — see *Why React and the router upgrade together* above. It also delivers the only user-visible change in the plan: URLs lose the `#`.

**Files:**
- Modify: `src/index.js`, `src/components/App.js`, `src/components/ScrollToTop.js`, `src/components/navigation/Navigation.js`, `src/components/common/Carousel.js:134`, `src/components/common/ScrollIntoView.js:14`, `vite.config.ts`, `package.json`
- Create: `public/robots.txt`

- [ ] **Step 1: Upgrade the packages and drop fastclick**

`fastclick` works around a 300ms tap delay browsers stopped exhibiting around 2015; on current browsers it causes double-fire bugs.

```bash
npm install react@19.3.0 react-dom@19.3.0 react-router-dom@7.18.4
npm uninstall fastclick
```

- [ ] **Step 2: Rewrite `src/index.js`**

Drops `FastClick`, swaps `ReactDOM.render` for `createRoot`, moves to `BrowserRouter`, and removes the `onChange` prop that was never a real react-router API. The hash rewrite preserves old inbound links.

```js
import "./styles/font-awesome.css";
import "./styles/main.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import ScrollToTop from "./components/ScrollToTop";

// Rewrite legacy hash URLs (#/games) to real paths so old inbound links survive.
const { hash } = window.location;
if (hash.startsWith("#/")) {
  window.history.replaceState(null, "", hash.slice(1));
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
```

- [ ] **Step 3: Rewrite `ScrollToTop.js` as a hook component**

`withRouter` no longer exists. This renders nothing and is a sibling of `<App>` rather than a wrapper.

```js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
```

- [ ] **Step 4: Rewrite `App.js`**

`Switch`→`Routes`, `component=`→`element=`, `exact` is gone (v7 matches exactly by default), `*` is the explicit catch-all. `App` no longer receives `location`, so `Navigation` reads it from the hook.

```js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./navigation/Navigation";
import Home from "./route-handlers/Home";
import AcademicWork from "./route-handlers/AcademicWork";
import Games from "./route-handlers/Games";
import Apps from "./route-handlers/Apps";
import Contact from "./route-handlers/Contact";
import Resume from "./route-handlers/Resume";
import NotFound from "./NotFound/NotFoundComponent";
import Container from "./common/Container";

const App = () => (
  <Container>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<Games />} />
      <Route path="/apps" element={<Apps />} />
      <Route path="/design" element={<AcademicWork />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Container>
);

export default App;
```

`/resume` is deliberately **absent from the nav** — reachable by direct URL only. Do not add it to `LINKS` in `Navigation.js`.

- [ ] **Step 5: Update `Navigation.js` to read location from the hook**

Add `useLocation` to the react-router import, then change:

```js
const Navigation = ({ location }) => {
  const isHome = location.pathname === "/";
  const isResume = location.pathname === "/resume";
```

to:

```js
const Navigation = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isResume = pathname === "/resume";
```

Delete the `Navigation.propTypes` block at the bottom — `location` is no longer a prop.

- [ ] **Step 6: Trim the resume contact line**

Per the spec's *Security and privacy* section: an unlinked page is still fully public. Phone number and home street address come out; the email stays. Keep `thomascheng81@gmail.com` — it differs from `/contact`'s `info@thomascheng.com` intentionally and must not be "corrected". Replace the `<Position>` block inside the `isResume` branch:

```jsx
            <Position>
              <a href="mailto:thomascheng81@gmail.com">
                thomascheng81@gmail.com
              </a>
            </Position>
```

- [ ] **Step 7: Remove the stray `exact` prop from `MobileLink`**

Verified before dispatch: `Navigation.js` contains **no** `activeClassName`. The `.active &` selector in `NavItem` works because react-router v4's `NavLink` applies the class `active` by default — and v7 does the same, merging it with the className styled-components passes in. **So do not add a `className` function**; that would override the default and break the underline.

The only change needed is on line 141, which passes `exact` — removed in v7, and it would be forwarded to the DOM as an unknown attribute:

```jsx
        <MobileLink to="/">
```

The nav underline is verified by hand in Step 14; if it has stopped working, the cause is this step.

- [ ] **Step 8: Remove `findDOMNode` from `Carousel.js`**

Removed in React 19. A one-liner, not a rewrite: `Carousel.js:351` already holds a callback ref to `Container`, and styled-components forwards refs to the underlying DOM node — so `this.wrapper` *is* the element.

Delete the import on line 4:

```js
import { findDOMNode } from "react-dom";
```

Change line 134 from `findDOMNode(this.wrapper).offsetWidth` to:

```js
    const frameWidth = this.wrapper.offsetWidth;
```

- [ ] **Step 9: Replace `componentWillReceiveProps` in `ScrollIntoView.js`**

Removed in React 19. The original fires when `isActive` goes false → true; `componentDidUpdate` expresses the same condition, inverted to read from `prevProps`. Replace the method signature and its guard:

```js
  componentDidUpdate(prevProps) {
    const { isActive } = this.props;

    if (prevProps.isActive || !isActive) {
      return;
    }
```

Leave the entire body below that guard — the `getBoundingClientRect` call and both `Animations.animate` blocks — exactly as it is.

- [ ] **Step 10: Emit `404.html` so deep links resolve on GitHub Pages**

Pages has no SPA rewrite. Serving the app shell as the 404 document makes `/games` boot the app, which then routes correctly. Replace `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    {
      name: "spa-404",
      closeBundle() {
        const dist = resolve(__dirname, "dist");
        copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
      },
    },
  ],
  build: { outDir: "dist" },
});
```

- [ ] **Step 11: Add `public/robots.txt`**

```
User-agent: *
Disallow: /resume
```

- [ ] **Step 12: Build and check the console**

```bash
npm run build && npm run preview
```

Confirm `dist/404.html` and `dist/robots.txt` exist. Open the console on `/design` — no `findDOMNode`, legacy-context, or lifecycle deprecation warnings.

- [ ] **Step 13: Verify carousel feel — the critical check in this task**

`animateToPane` calls `setState` once per frame from a `requestAnimationFrame` callback (`Carousel.js:193`). React 16 flushed those synchronously; React 18+ auto-batches updates from outside event handlers. One `rAF` tick should still yield one render, so this *should* be identical — but it is the single most likely place for smoothness to regress.

Repeat all four gestures from Task 1 Step 6 against the reference build still running from `/tmp/thomascheng-baseline`. Run both side by side. If the fling feels stepped, laggy, or differently damped, **stop and report it** rather than continuing.

- [ ] **Step 14: Verify routing**

- All six routes load by clicking through the nav.
- **Deep links load directly** — type `localhost:4173/design` in the address bar and press Enter. This exercises the `404.html` fallback; client-side navigation alone does not prove it.
- `localhost:4173/#/games` rewrites to `/games`.
- `/nonsense` renders NotFound.
- `/resume` renders, shows the email-only contact line with **no phone number and no street address**, and hides the nav links.
- `/resume` appears nowhere in the nav on any other page.
- The nav underline still marks the current page.
- On `/design`, pressing ArrowDown repeatedly scrolls each piece smoothly into view — that is `ScrollIntoView` exercising the lifecycle rewritten in Step 9.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat: upgrade to React 19 and react-router 7

These cannot be separated: react-router 4 relies on legacy context and
componentWillMount/componentWillReceiveProps, all removed in React 19,
while react-router 7 requires React 18+.

Replaces HashRouter with BrowserRouter and emits 404.html so GitHub
Pages resolves deep links; legacy #/path URLs redirect to /path. Drops
findDOMNode and fastclick.

Routes /resume by direct URL only, unlinked from the nav, with the
phone number and street address removed from its contact line."
```

---

### Task 4: Upgrade styled-components 4 → 6

Isolated in its own commit because this is where silent layout drift would come from. If something shifts, this commit reverts alone.

**Files:**
- Modify: `package.json`, `src/components/common/RandomImage.js`, `src/components/common/Carousel.js`, and any other file with custom props on styled DOM elements

- [ ] **Step 1: Upgrade**

```bash
npm install styled-components@6.5.3
```

- [ ] **Step 2: Enumerate every custom prop reaching a DOM element**

v6 forwards unknown props to the DOM unless they are transient (`$`-prefixed). Do not fix only the ones named below — find them all:

```bash
grep -rn "styled\.[a-z]" src --include="*.js"
```

For each result, read its interpolations and check each prop against valid HTML attributes for that element.

- [ ] **Step 3: Convert the confirmed instances**

`RandomImage.js:10` — `visible` is not a valid `<img>` attribute:

```js
const Image = styled.img`
  width: 100%;
  display: ${props => (props.$visible ? "block" : "none")};
`;
```

and at its usage:

```jsx
<Image key={image} $visible={imageShown === i} src={image} />
```

`Carousel.js` — `isMobile` on `Container` (lines 41-42) and `Item` (lines 55-56), `shouldWiggle` on `Container` (line 43), and `indicatorProgress` / `indicatorFinalPosition` on `ReturnIndicator` (lines 78-83). Rename each to its `$` form in **both** the template literal and the JSX. `Container` is also passed `isActive` (line 355) which no interpolation reads — delete that prop rather than renaming it.

- [ ] **Step 4: Build and check for prop warnings**

```bash
npm run build && npm run preview
```

Open the console on `/design` and `/`. React warns `Received 'false' for a non-boolean attribute` or `unknown prop` for anything missed. The console must be clean.

- [ ] **Step 5: Verify layout against the baseline**

Compare all five routes at 375/768/1440 against the Task 1 screenshots. Check margins and padding around carousels, and the mobile edge-to-edge bleed (`MOBILE_PADDING` negative margins) at 375px specifically.

- [ ] **Step 6: Verify the wiggle animation**

On `/apps` — a single-image carousel — click it. It should shake horizontally once. That exercises the `keyframes` interpolation in `Container`, the styled-components feature most likely to break across this upgrade.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: upgrade styled-components to v6

Converts custom props on styled DOM elements to transient ($) props
and removes an unused isActive prop from Carousel's Container."
```

---

### Task 5: Fix the carousel animation-name collision

A real bug found while writing the spec. Its own commit because it is a behavior change — it makes something work that is currently broken — and doing it before the TypeScript conversion keeps the diff readable. (The spec numbers this 5b and places it after the TS conversion; the order is swapped here for that reason, with no change to content.)

**The bug:** `CarouselLayout.js:56` destructures `title` out of props:

```js
const { description, title, isActive, ...other } = this.props;
```

so `title` never reaches `<Carousel {...other}>`. `Carousel` names its animation after it (`Carousel.js:187`, `:223`):

```js
name: "horizontalPan-" + this.props.title   // → "horizontalPan-undefined"
```

Every carousel registers under that one name, and `Animations.registerStart` stops any existing animation with that name before starting a new one (`utils/animations.js:5-7`). `/design` renders 11 carousels, so flinging one while another glides cancels the first mid-animation.

**Files:**
- Modify: `src/components/common/Carousel.js`

**Interfaces:**
- Produces: `Carousel` gains a private `animationName` instance field and a `nextId` static counter. Nothing outside the class reads either.

- [ ] **Step 1: Give each instance a unique animation name**

Not `title` — two pieces could legitimately share one. Add the static immediately after the `static propTypes = {…}` block:

```js
  static nextId = 0;
```

and the instance field immediately after the `state = {…}` block:

```js
  animationName = `horizontalPan-${Carousel.nextId++}`;
```

- [ ] **Step 2: Use it at both call sites**

`Carousel.js:187`, inside `animateToPane`:

```js
      name: this.animationName,
```

`Carousel.js:223`, inside `handleDrag`:

```js
      Animations.stop(this.animationName);
```

- [ ] **Step 3: Verify the bug is gone**

```bash
npm run build && npm run preview
```

On `/design` at 1440px, reproduce Task 1 Step 7: fling one carousel and immediately fling a different one. **Both must now glide to rest independently.** Confirm a single carousel's feel is unchanged — the fix must not alter easing or duration.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: stop carousels cancelling each other's animations

CarouselLayout strips the title prop before spreading into Carousel, so
every instance registered its pan animation as 'horizontalPan-undefined'.
With 11 carousels on /design, starting one cancelled any other in flight.
Each instance now gets a unique animation name."
```

---

### Task 6: Convert to TypeScript

Last of the behavior-affecting tasks, deliberately — by now the site is verified stable, so breakage here is a typing mistake, not a migration one.

**Files:**
- Create: `tsconfig.json`, `tsconfig.node.json`, `src/types/piece.ts`
- Modify: all 30 files under `src/`, renamed to `.ts`/`.tsx`; `index.html`; `package.json`

- [ ] **Step 1: Install**

TypeScript is pinned to 6.0.3, not 7.0.2 — see Global Constraints.

```bash
npm install -D typescript@6.0.3 @types/react@19.3.0 @types/react-dom@19.3.0
npm uninstall prop-types
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Update the scripts in `package.json`**

```json
"typecheck": "tsc --noEmit",
"build": "tsc --noEmit && vite build"
```

- [ ] **Step 5: Rename every source file**

Files containing JSX become `.tsx`; the four pure-logic files under `src/utils/` become `.ts`.

```bash
git mv src/utils/animations.js src/utils/animations.ts
git mv src/utils/breakpoints.js src/utils/breakpoints.ts
git mv src/utils/easings.js src/utils/easings.ts
git mv src/utils/math.js src/utils/math.ts
for f in $(git ls-files 'src/**/*.js' 'src/*.js'); do git mv "$f" "${f%.js}.tsx"; done
```

- [ ] **Step 6: Update the entry point reference in `index.html`**

```html
<script type="module" src="/src/index.tsx"></script>
```

- [ ] **Step 7: Create the shared `Piece` type**

The one non-obvious type here. The existing `CarouselPage.propTypes` (lines 14-32) describes a two-arm union; a discriminated union expresses it so the `switch (piece.type)` in `CarouselPage` narrows correctly. Create `src/types/piece.ts`:

```ts
export type CarouselPiece = {
  type: "carousel";
  title: string;
  images: string[];
  width: number;
  height: number;
  description?: string;
};

export type LinkPiece = {
  type: "link";
  title: string;
  url: string;
  image: string;
  width: number;
  height: number;
};

export type Piece = CarouselPiece | LinkPiece;
```

- [ ] **Step 8: Convert props file by file, deleting `propTypes` as you go**

For each file the existing `propTypes` block *is* the specification — transcribe it and delete it. `isRequired` means non-optional; its absence means `?`. Example, `RandomImage.tsx`:

```tsx
type RandomImageProps = {
  images: string[];
  className?: string;
};

class RandomImage extends React.Component<RandomImageProps, { imageShown: number }> {
```

Type the styled-components generics for the transient props introduced in Task 4:

```tsx
const Image = styled.img<{ $visible: boolean }>`
  width: 100%;
  display: ${props => (props.$visible ? "block" : "none")};
`;
```

Apply the same pattern to `Carousel.tsx`'s `Container`, `Item`, and `ReturnIndicator`.

- [ ] **Step 9: Type the two imperatively-assigned refs**

`Carousel.tsx` assigns `this.wrapper` from a callback ref; `CarouselLayout.tsx` assigns `this.carouselEl`:

```tsx
  wrapper: HTMLDivElement | null = null;
```

```tsx
  carouselEl: Carousel | null = null;
```

`CarouselLayout.handleClickCounter` calls `this.carouselEl.goToNextPane()`, so under `strict` it needs the guard `if (!this.carouselEl) return;`.

- [ ] **Step 10: Typecheck until clean**

```bash
npm run typecheck
```

Expected: no errors. Fix by adding types, **never** by adding `any` or `@ts-ignore`. If a type is genuinely hard, stop and report it rather than suppressing it.

- [ ] **Step 11: Build and verify**

```bash
npm run build && npm run preview
```

Walk all six routes and re-run the four carousel gestures from Task 1 Step 6. A `.js`→`.tsx` rename should change nothing at runtime; anything that moved is a conversion error.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: convert to TypeScript with strict mode

Replaces propTypes, which React 19 ignores, with compile-time types.
Pins TypeScript to 6.0.3 because typescript-eslint has no TS 7 support."
```

---

### Task 7: Replace Font Awesome with inline SVG

A 1,793-line stylesheet and ~4 MB of font binaries currently serve six icons. Rather than transcribing path data by hand — which invites subtly wrong glyphs — generate the component from the font already in the repo, then delete the font.

**Files:**
- Create: `scripts/generate-icons.mjs`, `src/components/common/Icon.tsx`
- Delete: `src/styles/font-awesome.css`, `src/fonts/` (6 files)
- Modify: `src/index.tsx`, `src/components/common/ArrowKeys.tsx`, `src/components/common/PageFooter.tsx`, `src/components/common/Carousel.tsx`

**Interfaces:**
- Produces: `<Icon name="hand-o-up" />` where `name` is `"arrow-left" | "hand-o-up" | "angle-up" | "angle-down" | "angle-left" | "angle-right"`. Accepts `className` so styled-components can wrap it, and `onClick`. Inherits color via `fill="currentColor"` and size via `width="1em" height="1em"`, matching how the font behaved.

- [ ] **Step 1: Write the generator**

Codepoints verified against `src/styles/font-awesome.css` lines 441, 644, 887-898. The font's coordinate system is Y-up with `units-per-em=1792` and `ascent=1536`; SVG is Y-down, hence the `translate(0,1536) scale(1,-1)` transform. Create `scripts/generate-icons.mjs`:

```js
import { readFileSync, writeFileSync } from "node:fs";

const FONT = "src/fonts/fontawesome-webfont.svg";
const ASCENT = 1536;
const UPM = 1792;

const ICONS = {
  "arrow-left": "f060",
  "hand-o-up": "f0a6",
  "angle-left": "f104",
  "angle-right": "f105",
  "angle-up": "f106",
  "angle-down": "f107",
};

const src = readFileSync(FONT, "utf8");
const defaultAdv = Number(/<font[^>]*horiz-adv-x="(\d+)"/.exec(src)[1]);
const byCodepoint = new Map();

for (const match of src.matchAll(/<glyph([^>]*)\/>/g)) {
  const attrs = match[1];
  const unicode = /unicode="&#x([0-9a-fA-F]+);"/.exec(attrs);
  const d = /\sd="([^"]+)"/.exec(attrs);
  if (!unicode || !d) continue;
  const adv = /horiz-adv-x="(\d+)"/.exec(attrs);
  byCodepoint.set(unicode[1].toLowerCase(), {
    d: d[1],
    adv: adv ? Number(adv[1]) : defaultAdv,
  });
}

const entries = Object.entries(ICONS).map(([name, cp]) => {
  const glyph = byCodepoint.get(cp);
  if (!glyph) throw new Error(`glyph ${name} (U+${cp}) not found in ${FONT}`);
  return `  "${name}": {\n    viewBox: "0 0 ${glyph.adv} ${UPM}",\n` +
         `    d: "${glyph.d}",\n  },`;
});

const output = `// Generated by scripts/generate-icons.mjs from the Font Awesome 4 SVG font.
// Do not edit by hand.
import React from "react";

const ICONS = {
${entries.join("\n")}
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  className?: string;
  onClick?: () => void;
};

const Icon = ({ name, className, onClick }: IconProps) => {
  const { viewBox, d } = ICONS[name];

  return (
    <svg
      className={className}
      onClick={onClick}
      viewBox={viewBox}
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(0, ${ASCENT}) scale(1, -1)">
        <path d={d} />
      </g>
    </svg>
  );
};

export default Icon;
`;

writeFileSync("src/components/common/Icon.tsx", output);
console.log(`generated ${entries.length} icons`);
```

- [ ] **Step 2: Generate, before deleting anything**

```bash
node scripts/generate-icons.mjs
```

Expected: `generated 6 icons`. If it throws `glyph … not found`, **stop** — the font file is the only source for this data and must not be deleted.

- [ ] **Step 3: Replace the icons in `ArrowKeys.tsx`**

Add `import Icon from "./Icon";`, then replace the four `<i>` elements with, in order:

```jsx
        <Icon name="angle-up" />
```

```jsx
        <Icon name="angle-left" />
```

```jsx
        <Icon name="angle-down" />
```

```jsx
        <Icon name="angle-right" />
```

The `Key` styled div sets `font-size: 14px` and `color`, which `1em` and `currentColor` inherit — so sizing and color carry over unchanged.

- [ ] **Step 4: Replace the icon in `PageFooter.tsx`**

`FooterIcon` is a `styled.i`. Point it at `Icon`, keeping every declaration:

```tsx
const FooterIcon = styled(Icon)`
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  color: #333;
  padding: 15px;
`;
```

and in `render`:

```jsx
        <FooterIcon name="hand-o-up" onClick={this.handleClick} />
```

- [ ] **Step 5: Replace the icon in `Carousel.tsx`**

`ReturnIndicator` is a `styled.i` positioned absolutely. Change its base to `Icon` and drop the `className`:

```tsx
const ReturnIndicator = styled(Icon)<{
  $indicatorProgress: number;
  $indicatorFinalPosition: number;
}>`
```

Keep the declaration body as it is, then update the JSX:

```jsx
            <ReturnIndicator
              name="arrow-left"
              $indicatorProgress={indicatorProgress}
              $indicatorFinalPosition={indicatorFinalPosition}
            />
```

- [ ] **Step 6: Delete the font and its stylesheet**

```bash
git rm -r src/fonts
git rm src/styles/font-awesome.css
```

Remove the import from the top of `src/index.tsx`:

```js
import "./styles/font-awesome.css";
```

- [ ] **Step 7: Confirm nothing references Font Awesome**

```bash
grep -rn "fa-\|font-awesome\|fontawesome" src index.html
```

Expected: no output.

- [ ] **Step 8: Build and verify every icon**

```bash
npm run build && npm run preview
```

- `/design` at 1440px: the arrow-key hint sits bottom-right with four chevrons pointing up/left/down/right. Each must point the **correct way** — a Y-flip error shows here first.
- The hand icon at the page bottom: click it; the page scrolls smoothly to the top.
- Drag a carousel hard past its right edge: the left-arrow return indicator fades in and slides. Check size and position against the baseline screenshot.

- [ ] **Step 9: Confirm the size drop**

```bash
du -sh dist
```

Expected: meaningfully smaller — roughly 4 MB of fonts are gone.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "perf: replace Font Awesome with six inline SVG icons

Drops a 1793-line stylesheet and ~4MB of font binaries that served six
icons. Paths are generated from the vendored SVG font by
scripts/generate-icons.mjs rather than transcribed by hand."
```

---

### Task 8: Fix the document head

**Files:**
- Modify: `index.html`, `src/components/route-handlers/Resume.tsx`

- [ ] **Step 1: Restore pinch-zoom**

`maximum-scale=1, user-scalable=no` blocks zoom — a WCAG 1.4.4 failure. Replace the viewport meta in `index.html`:

```html
    <meta name="viewport" content="width=device-width, initial-scale=1">
```

- [ ] **Step 2: Add description and social tags**

The site has none, so shared links render blank. Add inside `<head>`:

```html
    <meta name="description" content="Thomas Cheng is a developer and designer in Toronto. Portfolio of apps, games, and graphic design work.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://thomascheng.com/">
    <meta property="og:title" content="Thomas Cheng | Developer &amp; Designer">
    <meta property="og:description" content="Portfolio of apps, games, and graphic design work.">
    <meta name="twitter:card" content="summary">
```

- [ ] **Step 3: Add `noindex` to `/resume` only**

`robots.txt` (Task 3) asks crawlers not to fetch it; this covers those that do anyway. It is a request, not access control — which is why the address was removed in Task 3 rather than relying on this. Add to `Resume.tsx`, inside the component:

```tsx
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
```

Import `useEffect` from React. Verified before dispatch: `Resume` is already a function component (`Resume.js:189`), so no conversion is needed.

- [ ] **Step 4: Build and verify**

```bash
npm run build && npm run preview
```

- At phone width, pinch-to-zoom works.
- On `/resume`, DevTools → Elements shows `<meta name="robots" content="noindex">` in `<head>`.
- Navigate from `/resume` to `/contact`: that meta tag is **removed**. A leaked `noindex` would deindex the whole site.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: fix viewport, add meta description and social tags

Restores pinch-zoom (WCAG 1.4.4) and adds OpenGraph tags so shared
links render. Adds noindex to /resume only."
```

---

### Task 9: Compress images at build time

~150 images ship uncompressed. The transform runs at build time; sources in git stay untouched.

**Scope note:** the spec's Phase 6 called for AVIF/WebP with JPEG/PNG fallback. That needs `<picture>` elements in `Carousel`, `RandomImage`, and `LinkPiece`, which contradicts the constraint that `Carousel` gets exactly three edits. This task does lossy re-compression only — most of the byte savings, none of the markup churn. Modern formats are noted as possible future work in the spec.

**Files:**
- Modify: `vite.config.ts`, `package.json`

- [ ] **Step 1: Install**

```bash
npm install -D vite-plugin-image-optimizer@2.0.3 sharp
```

- [ ] **Step 2: Add the plugin to `vite.config.ts`**

Quality is set high deliberately — this is a design portfolio, and visible compression artifacts in the work samples would be a regression, not a win. Add the import:

```ts
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
```

and add to the `plugins` array, after `react()`:

```ts
    ViteImageOptimizer({
      jpg: { quality: 88 },
      jpeg: { quality: 88 },
      png: { quality: 90 },
    }),
```

- [ ] **Step 3: Measure before and after**

```bash
du -sh dist && npm run build && du -sh dist
```

Record both numbers for the final report.

- [ ] **Step 4: Verify image quality at full size**

Open `/design` at 1440px. Compare several carousel images against the Task 1 screenshots at **100% zoom**, looking for banding in gradients and ringing around type. The typography pieces ("Futura Type Specimen", "Meat Typography") are the sensitive ones — fine type shows artifacts first. If anything looks degraded, raise the quality values and rebuild.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "perf: compress images at build time

Quality kept high; this is a design portfolio and artifacts in the work
samples would be a regression."
```

---

### Task 10: ESLint and Prettier

The current `.eslintrc` names `babel-eslint` and `eslint-config-standard`, but `eslint` is not a dependency — nothing has linted this repo in years.

**Files:**
- Create: `eslint.config.js`, `.prettierrc`
- Delete: `.eslintrc`
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install -D eslint@10.11.0 typescript-eslint@8.70.0 @eslint/js@10.0.1 \
  eslint-plugin-react-hooks@7.1.1 globals@17.12.0 prettier@3.9.8
```

- [ ] **Step 2: Delete the orphaned config**

```bash
git rm .eslintrc
```

- [ ] **Step 3: Write `eslint.config.js`**

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", "scripts", "*.config.js", "*.config.ts"] },
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
```

- [ ] **Step 4: Write `.prettierrc`**

These values reproduce the existing formatting, last run with prettier 1.9.2. Keeping them means the formatting pass stays a no-op rather than a whole-repo reformat.

```json
{
  "arrowParens": "avoid",
  "trailingComma": "none"
}
```

- [ ] **Step 5: Add the scripts to `package.json`**

```json
"lint": "eslint .",
"format": "prettier --write \"src/**/*.{ts,tsx,css}\""
```

- [ ] **Step 6: Lint and fix**

```bash
npm run lint
```

Fix every error. If a rule is genuinely wrong for this codebase, disable it in `eslint.config.js` with a comment explaining why — do not scatter inline `eslint-disable` comments.

- [ ] **Step 7: Format, then confirm nothing moved**

```bash
npm run format
npm run build && npm run preview
```

Spot-check two routes against the baseline. Formatting must not change rendering; if it did, something else is wrong.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: add ESLint flat config and Prettier

Replaces an .eslintrc that referenced babel-eslint while eslint was not
even installed."
```

---

### Task 11: Deploy from GitHub Actions

Replaces the manual `gh-pages -d build` push. The `gh-pages` package was removed in Task 2.

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `package.json` (remove any surviving `predeploy`/`deploy` scripts)

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        if: github.ref == 'refs/heads/master'
        with:
          path: dist

  deploy:
    needs: build
    if: github.ref == 'refs/heads/master'
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify the build is reproducible from a clean install**

```bash
rm -rf node_modules && npm ci && npm run lint && npm run typecheck && npm run build
```

All four must pass. `npm ci` requires the lockfile committed in Task 1.

- [ ] **Step 3: Confirm the CNAME survives**

```bash
cat dist/CNAME
```

Expected: `thomascheng.com`. **If this file is missing, the custom domain breaks on deploy.**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: deploy to GitHub Pages from Actions

Replaces the manual gh-pages CLI push. Lints, typechecks, and builds on
pull requests; deploys only from master."
```

- [ ] **Step 5: Hand off the one manual step**

Deploying from Actions requires a repository setting that cannot be changed from here. Tell the site owner, in these words:

> In the repo on GitHub: **Settings → Pages → Build and deployment → Source**, change from "Deploy from a branch" to **"GitHub Actions"**. Until that is switched, the workflow will build successfully but the deploy step will fail.

Also confirm with them that `Settings → Pages → Custom domain` still reads `thomascheng.com` after the first successful deploy.

---

## Final verification

After Task 11, before merging, run the spec's full *Verification* checklist against `npm run preview`:

- [ ] All six routes load: `/`, `/games`, `/apps`, `/design`, `/contact`, `/resume`
- [ ] Nav moves between routes and marks the active link
- [ ] `/resume` is absent from the nav on every page
- [ ] `/resume` shows the email only — no phone number, no street address
- [ ] Carousel advances by click, arrow key, and drag/swipe
- [ ] Fling still decelerates smoothly; rubber-band at both ends feels right
- [ ] Two carousels on `/design` animate independently
- [ ] Single-image carousel on `/apps` wiggles on click
- [ ] `/nonsense` renders NotFound
- [ ] A deep link typed into the address bar loads
- [ ] `#/games` redirects to `/games`
- [ ] Pinch-zoom works at phone width
- [ ] All six icons render, correctly oriented
- [ ] All five original routes match the Task 1 screenshots at 375/768/1440
- [ ] Browser console is clean on every route
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` all pass from a clean `npm ci`

Then report: before/after bundle size, before/after `npm audit` count, and anything that looks different from the baseline, however minor.
