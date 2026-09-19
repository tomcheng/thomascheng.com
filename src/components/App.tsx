import { lazy, Suspense, type ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./navigation/Navigation";
import Home from "./route-handlers/Home";
import AcademicWork from "./route-handlers/AcademicWork";
import Games from "./route-handlers/Games";
import Apps from "./route-handlers/Apps";
import Contact from "./route-handlers/Contact";
import NotFound from "./NotFound/NotFoundComponent";
import Container from "./common/Container";
import {
  LETTERFALL_HOSTS,
  ROUTES,
  STANDALONE_ROUTES,
  type RoutePath,
  type StandaloneRoutePath
} from "../routes";

// Lazy so the physics engine behind it never lands in the main site bundle.
const Letterfall = lazy(() => import("./route-handlers/Letterfall"));

// Keyed by RoutePath so adding a route to src/routes.ts without adding its
// element here is a compile error, not a silent gap.
const routeElements: Record<RoutePath, ReactNode> = {
  "/": <Home />,
  "/games": <Games />,
  "/apps": <Apps />,
  "/design": <AcademicWork />,
  "/contact": <Contact />
};

const standaloneElements: Record<StandaloneRoutePath, ReactNode> = {
  "/letterfall": <Letterfall />
};

const Site = () => (
  <Container>
    <Navigation />
    <Routes>
      {ROUTES.map(path => (
        <Route key={path} path={path} element={routeElements[path]} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Container>
);

const isLetterfallHost = LETTERFALL_HOSTS.includes(window.location.hostname);

const App = () => (
  <Suspense fallback={null}>
    <Routes>
      {isLetterfallHost && <Route path="*" element={<Letterfall />} />}
      {STANDALONE_ROUTES.map(path => (
        <Route key={path} path={path} element={standaloneElements[path]} />
      ))}
      <Route path="*" element={<Site />} />
    </Routes>
  </Suspense>
);

export default App;
