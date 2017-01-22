import React from "react";
import { IndexRoute, Route } from "react-router";
import App from "./components/App";
import Home from "./components/route-handlers/Home";
import AcademicWork from "./components/route-handlers/AcademicWork";
import WorkWork from "./components/route-handlers/WorkWork";
import Miscellany from "./components/route-handlers/Miscellany";
import Contact from "./components/route-handlers/Contact";
import Resume from "./components/route-handlers/Resume";
import NotFound from "./components/NotFound/NotFoundComponent";

const routes = (
  <Route
    path="/"
    component={App}
    onChange={(prevState, nextState) => {
      if (nextState.location.action !== "POP") {
        window.scrollTo(0, 0);
      }
    }}
  >
    <IndexRoute component={Home} />
    <Route path="/academic-work" component={AcademicWork} />
    <Route path="/work" component={WorkWork} />
    <Route path="/miscellany" component={Miscellany} />
    <Route path="/contact" component={Contact} />
    <Route path="/resume" component={Resume} />
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;
