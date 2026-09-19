import "./styles/main.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import ScrollToTop from "./components/ScrollToTop";

// Rewrite legacy hash URLs (#/games) to real paths so old inbound links survive.
// Only same-origin single-slash paths qualify: a hash like "#//example.com" or
// "#/\evil.com" would slice down to a protocol-relative URL ("//example.com"),
// which replaceState throws a SecurityError on -- before createRoot runs,
// leaving a blank page. The negative lookahead rejects a second leading slash
// or backslash. The replaceState call is also wrapped in try/catch as a
// backstop: a hash that fails to redirect is far preferable to a hash that
// prevents the app from mounting at all.
const { hash } = window.location;
if (/^#\/(?![/\\])/.test(hash)) {
  try {
    window.history.replaceState(null, "", hash.slice(1));
  } catch {
    // Ignore malformed hashes; fall through and mount the app as-is.
  }
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
