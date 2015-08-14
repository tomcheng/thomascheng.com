import "styles/main.sass";

import React from "react";
import Router from "react-router";

import Navigation from "components/navigation/Navigation.jsx";

import Home from "components/route-handlers/Home.jsx";
import Portfolio from "components/route-handlers/AcademicWork.jsx";
import WorkWork from "components/route-handlers/WorkWork.jsx";
import Miscellany from "components/route-handlers/Miscellany.jsx";
import Resume from "components/route-handlers/Resume.jsx";

const {DefaultRoute, Link, Route, RouteHandler} = Router;

const App = React.createClass({
  render() {
    return (
      <div className="container">
        <Navigation links={links} />
        <RouteHandler />
      </div>
    );
  }
});

const links = [
  {
    path: "/",
    title: "Home",
    icon: "home"
  },
  {
    path: "/academic-work",
    title: "Academic Work",
    icon: "graduation-cap"
  },
  {
    path: "/work-work",
    title: "Work Work",
    icon: "briefcase"
  },
  {
    path: "/miscellany",
    title: "Miscellany",
    icon: "cogs"
  }
];

const routes = (
  <Route name="app" handler={App}>
    <Route name="home" path="/" handler={Home} />
    <Route name="academic-work" path="/academic-work" handler={Portfolio} />
    <Route name="work-work" path="/work-work" handler={WorkWork} />
    <Route name="miscellany" path="/miscellany" handler={Miscellany} />
    <Route name="resume" path="/resume" handler={Resume} />
  </Route>
);

React.initializeTouchEvents(true);

Router.run(routes, Handler => {
  React.render(<Handler/>, document.body);
});

