/**
 * Single source of truth for the app's known routes.
 *
 * Consumed by:
 *  - `components/App.tsx`, which builds its client-side `<Route>` elements
 *    from this list.
 *  - `vite.config.ts`'s `spa404` plugin, which emits a real
 *    `<route>/index.html` file per route at build time so GitHub Pages
 *    serves each one with an HTTP 200 instead of falling back to the 404
 *    document for every deep link.
 *
 * Add a route here once and both consumers pick it up -- there is nowhere
 * else a route path should be listed.
 */
export const ROUTES = ["/", "/games", "/apps", "/design", "/contact"] as const;

export type RoutePath = (typeof ROUTES)[number];

/**
 * Routes that render on their own, outside the site's navigation and layout
 * container. `App.tsx` mounts these beside the site shell rather than inside
 * it; `spa404` emits a real file for each exactly as it does for ROUTES.
 */
export const STANDALONE_ROUTES = ["/letterfall"] as const;

export type StandaloneRoutePath = (typeof STANDALONE_ROUTES)[number];

/**
 * Hostnames that are Letterfall and nothing else: on these, every path shows
 * the app rather than the portfolio. They are served the same build (see
 * `siteMeta` in vite.config.ts for how their index.html differs), so the
 * decision has to be made here, at runtime, from where the page was loaded.
 * `letterfall.localhost` resolves to this machine in any current browser, and
 * is how to see that behaviour against the dev server.
 */
export const LETTERFALL_HOSTS: readonly string[] = [
  "letterfall.app",
  "www.letterfall.app",
  "letterfall.localhost"
];
