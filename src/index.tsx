import "./styles/main.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import ScrollToTop from "./components/ScrollToTop";

// Rewrite legacy hash URLs (#/games) to real paths so old inbound links survive.
const { hash } = window.location;
if (hash.startsWith("#/")) {
  window.history.replaceState(null, "", hash.slice(1));
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
