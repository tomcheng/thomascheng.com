import "styles/main.sass";

import React from "react";
import Router from "react-router";
import FastClick from "fastclick";

import Navigation from "components/navigation/Navigation.jsx";

import Home from "components/route-handlers/Home.jsx";
import AcademicWork from "components/route-handlers/AcademicWork.jsx";
import WorkWork from "components/route-handlers/WorkWork.jsx";
import Miscellany from "components/route-handlers/Miscellany.jsx";
import Contact from "components/route-handlers/Contact.jsx";
import Resume from "components/route-handlers/Resume.jsx";

import NotFound from "components/NotFound/NotFoundComponent.jsx";

const {DefaultRoute, Route, RouteHandler, NotFoundRoute} = Router;

const App = React.createClass({
  getInitialState() {
    return { windowWidth: 0 };
  },

  componentDidMount() {
    this._getWindowWidth();

    window.addEventListener("resize", this._getWindowWidth);
  },

  componentWillMount() {
    document.addEventListener('DOMContentLoaded', () => {
      FastClick.attach(document.body);
    });
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this._getWindowWidth);
  },

  _getWindowWidth() {
    this.setState({
      windowWidth: window.innerWidth
    });
  },

  render() {
    const {windowWidth} = this.state;

    return (
      <div className="container">
        <Navigation links={links} />
        <RouteHandler windowWidth={windowWidth} />
      </div>
    );
  }
});

const links = [
  {
    path: "/work",
    title: "Work"
  },
  {
    path: "/academic-work",
    title: "Academic Work"
  },
  {
    path: "/miscellany",
    title: "Miscellany"
  },
  {
    path: "/contact",
    title: "Contact",
    hiddenOnMobile: true
  }
];

const routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="academic-work" path="/academic-work" handler={AcademicWork} />
    <Route name="work" path="/work" handler={WorkWork} />
    <Route name="miscellany" path="/miscellany" handler={Miscellany} />
    <Route name="contact" path="/contact" handler={Contact} />
    <Route name="resume" path="/resume" handler={Resume} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

React.initializeTouchEvents(true);

Router.run(routes, Router.HistoryLocation, Handler => {
  React.render(<Handler/>, document.body);
});

