import "./styles/main.sass";
import React from "react";
import { Router, browserHistory } from "react-router";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import routes from "routes";

const rootEl = document.getElementById("root");

FastClick.attach(rootEl);

ReactDOM.render((
  <Router history={browserHistory}>
    {routes}
  </Router>
), rootEl);

