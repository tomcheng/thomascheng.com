import "./styles/font-awesome.css";
import "./styles/main.css";
import React from "react";
import { Router, hashHistory } from "react-router";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import routes from "./Routes";

const rootEl = document.getElementById("root");

FastClick.attach(rootEl);

ReactDOM.render(
  <Router history={hashHistory}>
    {routes}
  </Router>,
  rootEl
);
