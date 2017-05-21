import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import Navigation from "./navigation/Navigation";
import Home from "./route-handlers/Home";
import AcademicWork from "./route-handlers/AcademicWork";
import WorkWork from "./route-handlers/WorkWork";
import Miscellany from "./route-handlers/Miscellany";
import Contact from "./route-handlers/Contact";
import Resume from "./route-handlers/Resume";
import NotFound from "./NotFound/NotFoundComponent";
import Container from "./common/Container";

const App = ({ location }) => (
  <Container>
    <Navigation location={location} />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/academic-work" component={AcademicWork} />
      <Route exact path="/work" component={WorkWork} />
      <Route exact path="/miscellany" component={Miscellany} />
      <Route exact path="/contact" component={Contact} />
      <Route exact path="/resume" component={Resume} />
      <Route path="/" component={NotFound} />
    </Switch>
  </Container>
);

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
