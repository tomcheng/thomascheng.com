import React from "react";
import PropTypes from "prop-types";
import Navigation from "./navigation/Navigation";
import Container from "./common/Container";

const App = ({ children, location }) => (
  <Container>
    <Navigation location={location} />
    {children}
  </Container>
);

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
