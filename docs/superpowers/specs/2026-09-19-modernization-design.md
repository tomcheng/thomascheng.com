# thomascheng.com Modernization — Design

**Date:** 2026-09-19
**Status:** Approved, pending spec review

## Problem

The site was last touched in November 2018 and has drifted out of the supported
ecosystem. It no longer builds on a current Node runtime:

```
Error: error:0308010C:digital envelope routines::unsupported
```

Webpack 4, vendored by `react-scripts` 2.1.1, calls an MD4 hash that OpenSSL 3
removed. The build only completes under `NODE_OPTIONS=--openssl-legacy-provider`,
a deprecated escape hatch. Verified against Node 22.22.1 on 2026-09-19.

Supporting facts, all verified in-repo:

| Area | Current | Notes |
|---|---|---|
| Build | `react-scripts` 2.1.1 (Nov 2018) | CRA unmaintained; deprecated 2025 |
| Node | `.nvmrc` = 6.11.5 | Node 6 reached EOL April 2019 |
| React | 16.6.3 | Latest 19.3.0 |
| Router | `react-router-dom` 4.3.1 | Latest 7.18.4; three breaking majors |
| Styling | `styled-components` 4.1.1 | Latest 6.5.3 |
| Audit | 187 vulns (27 critical) | Dev tree only; prod deps clean |
| Lockfile | never committed | builds are not reproducible |
| CI | none | manual `npm run deploy` |
| Lint | `.eslintrc` orphaned | names `babel-eslint`; eslint not a dependency |

Baseline production bundle (CRA, legacy flag): 105.2 KB gzip JS, 5.5 KB gzip CSS.

## Scope

Modernize the toolchain, dependencies, and deploy pipeline, **and** fix
web-platform defects that are invisible in a screenshot. The visual design is
explicitly out of scope: any rendering difference is a regression to fix, not an
improvement to keep.

### Decisions

| Question | Decision | Rationale |
|---|---|---|
| Scope | Infra + web-platform fixes | Design unchanged |
| Build tool | Vite 7 | Static client-side SPA; Next.js adds a framework this site would not use |
| Hosting | GitHub Pages + Actions | Keeps existing DNS; no manual dashboard step |
| Types | TypeScript, strict | React 19 ignores `propTypes`; existing declarations give the shapes |
| Verification | Playwright smoke tests | Committed suite; no pixel diffing |
| Strategy | Incremental, one concern per commit | Isolates the cause when something breaks |

### Non-goals

- Visual redesign, typography, color, or layout changes.
- Content changes, beyond removing code that no route reaches.
- Migration off `styled-components`. v6 is maintained and works with React 19;
  replacing it would mean rewriting every component's styling.
- Server-side rendering or a data layer. The site has neither and needs neither.

## Approach

Incremental migration on a branch, one concern per commit, with the site
building and running at the end of every phase.

The rejected alternative was a fresh Vite scaffold with components ported in.
It produces a cleaner history, but the site is broken from the first commit to
the last, so a visual regression discovered at the end cannot be attributed to
the change that caused it. The phased approach keeps each upgrade independently
bisectable, which matters most for `styled-components` v6 and React 19 — the two
changes most likely to shift layout silently.

## Phases

Each phase ends with: the site builds, the dev server runs, and the Playwright
suite passes. Phase 3 changes the URL scheme, so that phase's commit updates the
test suite's paths alongside the router change; every other phase must leave the
tests untouched. A phase that requires editing a test to pass is a phase that
changed behavior, and the edit needs justifying.

### Phase 0 — Safety net

- Commit `package-lock.json`.
- Build the current CRA site with the legacy OpenSSL flag; capture screenshots
  of all five routes at 375 / 768 / 1440 px. These are working reference
  material, not a committed test.
- Write the Playwright smoke suite and prove it passes against the CRA build
  before the stack moves underneath it.

Tests must pass against the *old* site first. A test suite written against the
new build only proves the new build is self-consistent.

### Phase 1 — CRA → Vite

- Replace `react-scripts` with Vite 7 + `@vitejs/plugin-react`.
- Move `index.html` from `public/` to the project root (Vite convention).
- **76 `require()` calls for images become ESM imports.** `require` does not
  exist in Vite. Distribution: `HomeMobile.js` 34, `AcademicWork.js` 28,
  `Games.js` 7, `HomeDesktop.js` 6, `Apps.js` 1.
- `.nvmrc` → Node 22. `public/CNAME` must survive into the build output.
- React stays at 16.6 through this phase.

### Phase 2 — React 16.6 → 19

- `ReactDOM.render` → `createRoot` (`src/index.js:14`).
- `findDOMNode` → callback ref (`src/components/common/Carousel.js:134`).
  Removed in React 19.
- `componentWillReceiveProps` → `componentDidUpdate`
  (`src/components/common/ScrollIntoView.js:14`). The method compares previous
  and next `isActive` to trigger a scroll animation; `componentDidUpdate` with
  `prevProps` expresses the same intent without the deprecated lifecycle.
- Remove `fastclick`. It works around a 300 ms tap delay that browsers stopped
  exhibiting around 2015; on current browsers it causes double-fire bugs.

### Phase 3 — Router 4 → 7, and clean URLs

- `Switch` → `Routes`, `component=` → `element=`, `withRouter` → `useLocation`,
  drop `exact`.
- `HashRouter` → `BrowserRouter`.
- Build copies `index.html` → `404.html` so deep links resolve on GitHub Pages.
  Unknown paths return HTTP 404 with a correctly rendered page — accepted
  tradeoff of staying on Pages.
- **Back-compat:** a boot-time redirect rewrites legacy `#/games` URLs to
  `/games` so existing inbound links keep working.
- Remove the dead `/resume` branch in `Navigation.js:135,146,155`. See
  *Security and privacy* below.

### Phase 4 — styled-components 4 → 6

- Upgrade and adopt transient props: custom props on styled DOM elements must
  become `$`-prefixed or v6 forwards them to the DOM. Confirmed instance:
  `visible` in `RandomImage.js:10`. Candidates seen while reading —
  `isMobile`, `indicatorProgress`, `indicatorFinalPosition`, `hiddenOnMobile`.
  The phase begins by enumerating every `styled.<htmlTag>` in the codebase and
  checking each interpolated prop against valid DOM attributes, rather than
  fixing only the ones listed here.
- No `injectGlobal`, `.extend`, or `.attrs` usage exists, so the main v4→v5
  breakages do not apply.

### Phase 5 — TypeScript

- Convert ~30 source files to `.ts`/`.tsx`, `strict: true`.
- Existing `propTypes` declarations supply the prop shapes; delete them and the
  `prop-types` dependency once converted.

### Phase 6 — Platform cleanup

- **Font Awesome 4 → 6 inline SVGs.** A 1,793-line CSS file and ~4 MB of
  `.otf`/`.ttf`/`.eot`/`.woff`/`.svg` binaries currently serve six icons:
  `fa-hand-o-up`, `fa-arrow-left`, `fa-angle-up`, `fa-angle-left`,
  `fa-angle-down`, `fa-angle-right`.
- Restore pinch-zoom: drop `maximum-scale=1, user-scalable=no` from the viewport
  meta. Blocking zoom is an accessibility failure (WCAG 1.4.4).
- Add `<meta name="description">` and OpenGraph/Twitter card tags. The site
  currently has none, so shared links render blank.
- Compress the ~150 images in `src/images/` and serve AVIF/WebP with the
  original JPEG/PNG as fallback, via a Vite image plugin so the transform runs
  at build time and the sources stay untouched in git. Dimensions and visual
  quality must not change.

### Phase 7 — Tooling and CI

- ESLint flat config (`eslint.config.js`) + `typescript-eslint` + Prettier,
  replacing the orphaned `.eslintrc`. Add `lint` and `format` scripts.
- GitHub Actions: build and deploy to Pages on push to `master`, replacing the
  manual `gh-pages` CLI. Run lint, typecheck, and Playwright on pull requests.

## Verification

Playwright smoke tests, run in CI:

- Each of `/`, `/games`, `/apps`, `/design`, `/contact` loads and renders its
  distinguishing content.
- Navigation moves between routes and marks the active link.
- Carousel advances by click, by arrow key, and by touch swipe.
- An unknown path renders the NotFound component.
- A deep link loads directly (not just via client-side navigation) — this is
  what proves the `404.html` fallback works.
- A legacy `#/games` URL redirects to `/games`.

Per the agreed scope there is **no pixel-diffing**. The screenshot baseline from
Phase 0 is checked by eye at each phase. This is the known weak point: a subtle
layout shift from the styled-components upgrade could pass unnoticed.

## Security and privacy

`Navigation.js:146` renders, on the `/resume` path, a personal phone number and
home street address:

```
thomascheng81@gmail.com | 647-772-3277 | 502-160 Baldwin St, Toronto, ON, M5T 3K7
```

No route in `App.js` reaches this branch today, so the data is in the repository
and in the shipped bundle but not on any reachable page.

`Resume.js` itself contains no personal data — only work history and education.
The contact line above is the sole instance, and it lives in `Navigation.js`.

**Decision: leave `/resume` unrouted, delete the dead branch in
`Navigation.js`, and leave `Resume.js` in place unchanged.** An earlier
draft proposed wiring the route up because `Resume.js` appears complete; reading
what it renders reverses that. Publishing a home address is not a default to
adopt silently. The git history retains it if the owner wants it back, and
routing it later is a small change.

Note the branch also uses a different address (`thomascheng81@gmail.com`) than
the live contact page (`info@thomascheng.com`).

## Risks

| Risk | Mitigation |
|---|---|
| URL scheme changes; pages re-indexed | Hash-redirect preserves inbound links; five pages is a small surface |
| styled-components v6 shifts layout silently | Isolated to its own phase and commit; screenshot check |
| 76 image imports converted by hand | Smoke tests assert images render; a missed import fails the build in Vite, not at runtime |
| Deep links return HTTP 404 status | Accepted cost of GitHub Pages; page renders correctly |
| TypeScript conversion touches every file | Last phase, after behavior is verified stable |

## Out of scope, worth noting later

- `Carousel.js` is 394 lines and mixes touch handling, animation, keyboard
  input, and layout. It is the most likely source of future bugs. Splitting it
  is a refactor, not a modernization, and is deliberately excluded here.
