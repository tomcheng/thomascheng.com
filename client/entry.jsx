import "styles/main.sass";

import React from "react";
import Router from "react-router";

import Home from "components/home/Home.jsx";
import Header from "components/header/Header.jsx";
import Portfolio from "components/academic-work/AcademicWork.jsx";
import FreshBooks from "components/freshbooks/FreshBooks.jsx";
import PhotocopiedFaces from "components/photocopied-faces/PhotocopiedFaces.jsx";
import Navigation from "components/navigation/Navigation.jsx";

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
            path: "/freshbooks",
            title: "FreshBooks",
          },
          {
            path: "/academic-work",
            title: "Academic Work",
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
  </Route>
);

React.initializeTouchEvents(true);

Router.run(routes, Handler => {
  React.render(<Handler/>, document.body);
});

