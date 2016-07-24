import "./styles/main.sass";
import React from "react";
import { Router, IndexRoute, Route, browserHistory } from "react-router";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import Navigation from "./components/navigation/Navigation.jsx";
import Home from "./components/route-handlers/Home.jsx";
import AcademicWork from "./components/route-handlers/AcademicWork.jsx";
import WorkWork from "./components/route-handlers/WorkWork.jsx";
import Miscellany from "./components/route-handlers/Miscellany.jsx";
import Contact from "./components/route-handlers/Contact.jsx";
import Resume from "./components/route-handlers/Resume.jsx";

import NotFound from "./components/NotFound/NotFoundComponent.jsx";

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

const App = React.createClass({
  getInitialState() {
    return { windowWidth: 0 };
  },

  componentDidMount() {
    this.getWindowWidth();
    window.addEventListener("resize", this.getWindowWidth);
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.getWindowWidth);
  },

  getWindowWidth() {
    this.setState({ windowWidth: window.innerWidth });
  },

  render() {
    const { windowWidth } = this.state;

    return (
      <div className="container">
        <Navigation links={links} location={this.props.location} />
        {React.cloneElement(this.props.children, { windowWidth })}
      </div>
    );
  }
});

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/academic-work" component={AcademicWork} />
    <Route path="/work" component={WorkWork} />
    <Route path="/miscellany" component={Miscellany} />
    <Route path="/contact" component={Contact} />
    <Route path="/resume" component={Resume} />
    <Route path="*" component={NotFound} />
  </Route>
);

FastClick.attach(document.getElementById("root"));

ReactDOM.render((
  <Router history={browserHistory}>
    {routes}
  </Router>
), document.getElementById("root"));

