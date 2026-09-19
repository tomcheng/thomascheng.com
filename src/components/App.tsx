import type { ReactNode } from "react";
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
import { ROUTES, type RoutePath } from "../routes";

// Keyed by RoutePath so adding a route to src/routes.ts without adding its
// element here is a compile error, not a silent gap.
const routeElements: Record<RoutePath, ReactNode> = {
  "/": <Home />,
  "/games": <Games />,
  "/apps": <Apps />,
  "/design": <AcademicWork />,
  "/contact": <Contact />,
  "/resume": <Resume />,
};

const App = () => (
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

export default App;
