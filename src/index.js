import "./styles/font-awesome.css";
import "./styles/main.css";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import FastClick from "fastclick";
import App from "./components/App";
import ScrollToTop from "./components/ScrollToTop";

const rootEl = document.getElementById("root");

// fastclick's CJS export IS the attach() factory itself (module.exports =
// FastClick.attach), not the FastClick class. Under CRA/webpack this got
// minified in a way that accidentally rebound the default export to the
// class (which also happens to expose a static .attach), so
// `FastClick.attach(...)` "worked" there. Vite's ESM interop reports the
// module's real shape, where `FastClick` is already the attach factory.
FastClick(rootEl);

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
