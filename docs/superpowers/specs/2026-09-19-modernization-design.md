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
| Build tool | Vite 8 | Static client-side SPA; Next.js adds a framework this site would not use |
| Hosting | GitHub Pages + Actions | Keeps existing DNS; no manual dashboard step |
| Types | TypeScript, strict | React 19 ignores `propTypes`; existing declarations give the shapes |
| Verification | Manual browser check per phase | Five static pages; no committed suite to maintain |
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

Each phase ends with: the site builds, the dev server runs, and the manual
browser check in *Verification* passes.

### Phase 0 — Safety net

- Commit `package-lock.json`.
- Build the current CRA site with the legacy OpenSSL flag and keep the output
  as the reference build.
- Capture screenshots of all five routes at 375 / 768 / 1440 px from that build.
  Working reference material, not committed to the repository.

### Phase 1 — CRA → Vite

- Replace `react-scripts` with Vite 7 + `@vitejs/plugin-react`.
- Move `index.html` from `public/` to the project root (Vite convention).
- **76 `require()` calls for images become ESM imports.** `require` does not
  exist in Vite. Distribution: `HomeMobile.js` 34, `AcademicWork.js` 28,
  `Games.js` 7, `HomeDesktop.js` 6, `Apps.js` 1.
- `.nvmrc` → Node 22. `public/CNAME` must survive into the build output.
- React stays at 16.6 through this phase.

> **Amended 2026-09-19, during planning: Phases 2 and 3 must land as a single
> commit.** React 19 removes legacy context (`contextTypes` /
> `childContextTypes`) and the unprefixed `componentWillMount` /
> `componentWillReceiveProps`. `react-router` 4.3.1 uses all three —
> `node_modules/react-router/Router.js:72,92,113,116` and
> `Route.js:90,98,147,154` — and legacy context is *how* it passes location
> down, so it breaks rather than warns. react-router 7 in turn requires React
> 18+. Neither can move first. They are kept as separate phases below for
> readability; the implementation plan merges them into its Task 3.

### Phase 2 — React 16.6 → 19

- `ReactDOM.render` → `createRoot` (`src/index.js:14`).
- `findDOMNode` → direct ref access (`src/components/common/Carousel.js:134`).
  Removed in React 19. The fix is a one-liner: `Carousel.js:351` already holds a
  callback ref to the `Container`, and styled-components forwards refs to the
  underlying DOM node, so `this.wrapper` *is* the element. `findDOMNode` has
  been redundant here for years — it becomes `this.wrapper.offsetWidth`.
- `componentWillReceiveProps` → `componentDidUpdate`
  (`src/components/common/ScrollIntoView.js:14`). The method compares previous
  and next `isActive` to trigger a scroll animation; `componentDidUpdate` with
  `prevProps` expresses the same intent without the deprecated lifecycle.
- Remove `fastclick`. It works around a 300 ms tap delay that browsers stopped
  exhibiting around 2015; on current browsers it causes double-fire bugs.

**Watch item:** `Carousel.animateToPane` calls `setState` once per animation
frame from a `requestAnimationFrame` callback (`Carousel.js:193`). React 16 flushed
those synchronously; React 18+ auto-batches updates originating outside event
handlers. One `rAF` tick still yields one render, so this should be visually
identical — but it is the single most likely place for carousel smoothness to
regress, and it gets a deliberate side-by-side check against the reference build.

### Phase 3 — Router 4 → 7, and clean URLs

- `Switch` → `Routes`, `component=` → `element=`, `withRouter` → `useLocation`,
  drop `exact`.
- `HashRouter` → `BrowserRouter`.
- Build copies `index.html` → `404.html` so deep links resolve on GitHub Pages.
  Unknown paths return HTTP 404 with a correctly rendered page — accepted
  tradeoff of staying on Pages.
- **Back-compat:** a boot-time redirect rewrites legacy `#/games` URLs to
  `/games` so existing inbound links keep working.
- Add the `/resume` route, reachable by direct URL only. It is deliberately
  absent from the nav `LINKS` list, so the existing `isResume` branches in
  `Navigation.js:135,146,155` become live rather than dead. See *Security and
  privacy* below for the contact-line change and `noindex`.

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
- **Pin TypeScript to 6.0.3, not the current 7.0.2.** `typescript-eslint@8.70.0`
  declares `peerDependencies.typescript: ">=4.8.4 <6.1.0"`, and no released
  `typescript-eslint` supports TS 7. Typed linting on a codebase this size is
  worth more than being one major ahead. Revisit when support ships.

### Phase 5b — Carousel animation-name collision (bug fix)

Found while reading the code for this spec. `CarouselLayout.js:56` destructures
`title` out of props:

```js
const { description, title, isActive, ...other } = this.props;
```

so `title` never reaches `<Carousel {...other}>`. `Carousel` names its animation
after it (`Carousel.js:187`, `:223`):

```js
name: "horizontalPan-" + this.props.title   // → "horizontalPan-undefined"
```

Every carousel therefore registers under the identical name, and
`Animations.registerStart` stops any existing animation with that name before
starting a new one (`utils/animations.js:5-7`). `/design` renders **11**
carousels, so flinging one while another is still gliding cancels the first
mid-animation.

**Fix:** give each `Carousel` instance a unique id at construction and use that
as the animation name. Not `title` — two pieces could legitimately share one.

Kept in its own commit, separate from the mechanical upgrades, because it is a
behavior change: it makes something work that is currently broken.

### Phase 6 — Platform cleanup

- **Font Awesome 4 → 6 inline SVGs.** A 1,793-line CSS file and ~4 MB of
  `.otf`/`.ttf`/`.eot`/`.woff`/`.svg` binaries currently serve six icons:
  `fa-hand-o-up`, `fa-arrow-left`, `fa-angle-up`, `fa-angle-left`,
  `fa-angle-down`, `fa-angle-right`.
- Restore pinch-zoom: drop `maximum-scale=1, user-scalable=no` from the viewport
  meta. Blocking zoom is an accessibility failure (WCAG 1.4.4).
- Add `<meta name="description">` and OpenGraph/Twitter card tags. The site
  currently has none, so shared links render blank.
- Add `<meta name="robots" content="noindex">` on `/resume` only.
- Compress the ~150 images in `src/images/` via a Vite image plugin, so the
  transform runs at build time and the sources stay untouched in git.
  Dimensions and visual quality must not change; quality settings stay high
  because artifacts in a design portfolio's work samples are a regression.

  **Amended 2026-09-19, during planning:** an earlier draft also called for
  AVIF/WebP with JPEG/PNG fallback. That requires `<picture>` elements in
  `Carousel`, `RandomImage`, and `LinkPiece`, which contradicts the constraint
  that `Carousel` receives only three edits. Re-compression alone captures most
  of the saving with none of the markup churn. Modern formats are deferred to
  *Out of scope* below.

### Phase 7 — Tooling and CI

- ESLint flat config (`eslint.config.js`) + `typescript-eslint` + Prettier,
  replacing the orphaned `.eslintrc`. Add `lint` and `format` scripts.
- GitHub Actions: build and deploy to Pages on push to `master`, replacing the
  manual `gh-pages` CLI. Run lint and typecheck on pull requests.

## Verification

No test suite is committed. The site is five static pages, and a suite here
would be maintenance weight rather than protection. Verification is a manual
browser pass at the end of every phase, against this checklist:

- Each of `/`, `/games`, `/apps`, `/design`, `/contact`, `/resume` loads and
  renders its content.
- Navigation moves between routes and marks the active link.
- Carousel advances by click, by arrow key, and by drag/swipe; the fling still
  decelerates smoothly and the rubber-band at both ends still feels right.
- Two carousels on `/design` animate independently without cancelling each
  other (see Phase 5b).
- An unknown path renders the NotFound component.
- A deep link loads directly, not only via client-side navigation — this is what
  proves the `404.html` fallback works.
- A legacy `#/games` URL redirects to `/games`.
- Rendering matches the Phase 0 screenshots at 375 / 768 / 1440 px.

**Known weakness, accepted:** checking by eye catches layout breakage but can
miss a few pixels of drift, and nothing guards against regressions after this
work ships. The styled-components v4→v6 phase is where that risk concentrates,
which is why it is isolated in its own commit and can be reverted alone.

## Security and privacy

`Navigation.js:146` renders, on the `/resume` path, a personal phone number and
home street address:

```
thomascheng81@gmail.com | 647-772-3277 | 502-160 Baldwin St, Toronto, ON, M5T 3K7
```

`Resume.js` itself contains no personal data — only work history and education.
The contact line above is the sole instance, and it lives in `Navigation.js`.

**Decisions:**

1. `/resume` becomes reachable by direct URL, but is not linked from the nav.
2. **The phone number and street address are removed from that line, leaving the
   email.** Not linking a page is not access control: an unlinked page is fully
   public to anyone with the URL and to any crawler that finds it. A resume
   reader needs a way to reply, not a home address.
3. `/resume` carries `noindex` to keep it out of search results — a request
   crawlers honor, not a guarantee, which is why decision 2 does the real work.
4. The remaining address stays `thomascheng81@gmail.com`, as originally written
   — confirmed by the site owner on 2026-09-19. This intentionally differs from
   the `info@thomascheng.com` on `/contact`: the resume routes to a personal
   address, the public contact page to a site address. Not an inconsistency to
   "fix" later.

## Risks

| Risk | Mitigation |
|---|---|
| URL scheme changes; pages re-indexed | Hash-redirect preserves inbound links; five pages is a small surface |
| styled-components v6 shifts layout silently | Isolated to its own phase and commit; screenshot check |
| 76 image imports converted by hand | A missed import fails the Vite build rather than breaking at runtime; screenshots confirm every image still renders |
| Deep links return HTTP 404 status | Accepted cost of GitHub Pages; page renders correctly |
| TypeScript conversion touches every file | Last phase, after behavior is verified stable |
| Carousel feel degrades under React 18+ batching | Called out as a watch item in Phase 2; checked by hand against the reference build |
| No regression protection after this ships | Accepted; see *Verification* |

## Note on `Carousel.js`

An earlier draft of this spec listed `Carousel.js` as the codebase's weakest
point on the strength of its 394 lines. Reading it does not support that, and
the claim is withdrawn.

It is a deliberately tuned component: per-situation easings in
`handleDragRelease` (`elasticOut` past the start, `bounceOut` past the end,
`cubicOut` for a velocity fling, `cubicInOut` for keyboard), fling duration
derived from pointer velocity and clamped to 200–400 ms (`:266`), rubber-band
resistance past the bounds via `DRAG_CONSTANT`, a drag-past-end-to-wrap gesture
with a proportionally fading indicator, and `translate3d` throughout to keep
compositing on the GPU. The pane arithmetic is three small pure functions over a
shared `constrain` helper. The length is inherent to a physics-driven drag
surface, not a sign of tangled responsibilities.

**Therefore: no refactor, and the minimum possible edits.** It changes in
exactly three places — `findDOMNode` removal (Phase 2), transient props
(Phase 4), and the animation-name fix (Phase 5b). Its behavior is the part of
this site most worth preserving exactly.

## Future work, deliberately excluded

- **AVIF/WebP with `<picture>` fallback.** Worthwhile, but it means markup
  changes in three components including `Carousel`. Better done as its own
  change once the stack is stable.
- **Splitting `Carousel.js`.** Not indicated — see the note above.
- **TypeScript 7.** Blocked on `typescript-eslint` support.
