import React from "react";
import Navigation from "./navigation/Navigation";

const App = ({ children, location }) => (
  <div className="container">
    <Navigation location={location} />
    {children}
  </div>
);

App.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
