import React from "react";
import Navigation from "./navigation/Navigation";
import Container from "./common/Container";

const App = ({ children, location }) => (
  <Container>
    <Navigation location={location} />
    {children}
  </Container>
);

App.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
