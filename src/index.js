import "./styles/font-awesome.css";
import "./styles/main.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import App from "./components/App";
import ScrollToTop from "./components/ScrollToTop";

const rootEl = document.getElementById("root");

FastClick.attach(rootEl);

ReactDOM.render(
  <Router>
    <ScrollToTop>
      <Route
        path="/"
        component={App}
        onChange={(prevState, nextState) => {
          if (nextState.location.action !== "POP") {
            window.scrollTo(0, 0);
          }
        }}
      />
    </ScrollToTop>
  </Router>,
  rootEl
);
