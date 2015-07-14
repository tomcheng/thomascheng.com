import "styles/main.sass";

import React from "react";
import Router from "react-router";

import Home from "components/home/Home.jsx";
import Header from "components/header/Header.jsx";
import Portfolio from "components/portfolio/Portfolio.jsx";
import Navigation from "components/navigation/Navigation.jsx";

const {DefaultRoute, Link, Route, RouteHandler} = Router;

const App = React.createClass({
  render() {
    return (
      <Navigation
        headerComponent={<Header />}
        bodyComponent={<RouteHandler />} />
    );
  }
});

const routes = (
  <Route name="app" handler={App}>
    <Route name="home" path="/" handler={Home} />
    <Route name="portfolio" path="/portfolio" handler={Portfolio} />
  </Route>
);

React.initializeTouchEvents(true);

Router.run(routes, Handler => {
  React.render(<Handler/>, document.body);
});

