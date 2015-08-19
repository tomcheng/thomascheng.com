import "styles/main.sass";

import React from "react";
import Router from "react-router";

import Navigation from "components/navigation/Navigation.jsx";
import Header from "components/header/Header.jsx";

import Home from "components/route-handlers/Home.jsx";
import AcademicWork from "components/route-handlers/AcademicWork.jsx";
import WorkWork from "components/route-handlers/WorkWork.jsx";
import Miscellany from "components/route-handlers/Miscellany.jsx";
import Resume from "components/route-handlers/Resume.jsx";

import NotFound from "components/NotFound/NotFoundComponent.jsx";

const {DefaultRoute, Link, Route, RouteHandler, NotFoundRoute} = Router;

const MOBILE_BREAKPOINT = 768;

const App = React.createClass({
  getInitialState() {
    return { isMobile: false };
  },

  componentDidMount() {
    this._setDimensions();

    window.addEventListener("resize", this._setDimensions);
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this._setDimensions);
  },

  _setDimensions() {
    this.setState({
      isMobile: window.innerWidth < MOBILE_BREAKPOINT
    });
  },

  render() {
    const {isMobile} = this.state;

    return (
      <div className="container">
        {!isMobile ? <Header /> : null}
        <div className="row">
          <div className="col-sm-3">
            <Navigation links={links} isMobile={isMobile} />
          </div>
          <div className="col-sm-9">
            <RouteHandler isMobile={isMobile} />
          </div>
        </div>
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
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="academic-work" path="/academic-work" handler={AcademicWork} />
    <Route name="work-work" path="/work-work" handler={WorkWork} />
    <Route name="miscellany" path="/miscellany" handler={Miscellany} />
    <Route name="resume" path="/resume" handler={Resume} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

React.initializeTouchEvents(true);

Router.run(routes, Handler => {
  React.render(<Handler/>, document.body);
});

