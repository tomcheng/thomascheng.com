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
export const ROUTES = [
  "/",
  "/games",
  "/apps",
  "/design",
  "/contact",
  "/resume",
] as const;

export type RoutePath = (typeof ROUTES)[number];
