import "./styles/font-awesome.css";
import "./styles/main.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import App from "./components/App";

const rootEl = document.getElementById("root");

FastClick.attach(rootEl);

ReactDOM.render(
  <Router>
    <Route
      path="/"
      component={App}
      onChange={(prevState, nextState) => {
        if (nextState.location.action !== "POP") {
          window.scrollTo(0, 0);
        }
      }}
    />
  </Router>,
  rootEl
);
