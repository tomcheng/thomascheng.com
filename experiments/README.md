# Experiments

Standalone things that live in this repo but are not part of the portfolio.
Each one is its own site, on its own domain, and shares nothing with
thomascheng.com except the tooling (TypeScript, ESLint, Prettier, Vite).

| Experiment | Domain |
| --- | --- |
| `letterfall` | [letterfall.app](https://letterfall.app) |
| `letterbug` | none (not deployed) |

## How it works

The `SITE` environment variable picks what Vite builds or serves:

- unset: the portfolio, from the repo root, exactly as before
- `SITE=<name>`: only `experiments/<name>/`, with that folder as the site root

Either way the output goes to `dist/`. An experiment's build contains no
portfolio code, and the portfolio's build contains no experiments.

```sh
SITE=letterfall npm run dev     # http://localhost:5173/
SITE=letterfall npm run build
```

## Adding one

1. Create `experiments/<name>/index.html`. It is an ordinary Vite entry: point a
   `<script type="module">` at a `.ts` or `.tsx` file beside it. Give it its own
   `<title>`, description and `og:` tags. Static files go in
   `experiments/<name>/public/`.
2. Add a Cloudflare Pages project connected to this repo: build command
   `npm run build`, output directory `dist`, environment variable
   `SITE=<name>`. Attach the domain under the project's Custom domains tab.
   With no `404.html` in the output, Pages serves `index.html` for every path.
3. Add a row to the table above, and a build step for it in
   `.github/workflows/deploy.yml` so CI catches it breaking.
