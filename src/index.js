import "./styles/main.sass";
import React from "react";
import { Router, browserHistory } from "react-router";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import Routes from "Routes";

const rootEl = document.getElementById("root");

FastClick.attach(document.getElementById("root"));

ReactDOM.render((
  <Router history={browserHistory}>
    {Routes}
  </Router>
), rootEl);

