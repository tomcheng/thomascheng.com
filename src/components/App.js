import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import Navigation from "./navigation/Navigation";
import Home from "./route-handlers/Home";
import AcademicWork from "./route-handlers/AcademicWork";
import UiUx from "./route-handlers/UiUx";
import Miscellany from "./route-handlers/Miscellany";
import Contact from "./route-handlers/Contact";
import NotFound from "./NotFound/NotFoundComponent";
import Container from "./common/Container";

const App = ({ location }) =>
  <Container>
    <Navigation location={location} />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/ui-ux" component={UiUx} />
      <Route exact path="/print" component={AcademicWork} />
      <Route exact path="/apps" component={Miscellany} />
      <Route exact path="/contact" component={Contact} />
      <Route path="/" component={NotFound} />
    </Switch>
  </Container>;

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default App;
