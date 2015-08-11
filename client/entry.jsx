import "styles/main.sass";

import React from "react";
import Router from "react-router";

import Header from "components/header/Header.jsx";
import Navigation from "components/navigation/Navigation.jsx";

import Home from "components/route-handlers/Home.jsx";
import Portfolio from "components/route-handlers/AcademicWork.jsx";
import FreshBooks from "components/route-handlers/FreshBooks.jsx";
import PhotocopiedFaces from "components/route-handlers/PhotocopiedFaces.jsx";
import Resume from "components/route-handlers/Resume.jsx";

const {DefaultRoute, Link, Route, RouteHandler} = Router;

const App = React.createClass({
  render() {
    return (
      <Navigation
        headerComponent={<Header />}
        bodyComponent={<RouteHandler />}
        links={[
          {
            path: "/",
            title: "Home",
          },
          {
            path: "/academic-work",
            title: "Academic Work",
          },
          {
            path: "/freshbooks",
            title: "FreshBooks",
          },
          {
            path: "/photocopied-faces",
            title: "Photocopied Faces",
          }
        ]} />
    );
  }
});

const routes = (
  <Route name="app" handler={App}>
    <Route name="home" path="/" handler={Home} />
    <Route name="academic-work" path="/academic-work" handler={Portfolio} />
    <Route name="freshbooks" path="/freshbooks" handler={FreshBooks} />
    <Route name="photocopied-faces" path="/photocopied-faces" handler={PhotocopiedFaces} />
    <Route name="resume" path="/resume" handler={Resume} />
  </Route>
);

React.initializeTouchEvents(true);

Router.run(routes, Handler => {
  React.render(<Handler/>, document.body);
});

