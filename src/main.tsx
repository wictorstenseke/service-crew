import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Detect iPad and add class to body for CSS targeting
function detectiPad() {
  // Modern iPad detection: iPadOS 13+ reports as MacIntel with touch support
  const isModerniPad =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  // Legacy iPad detection via user agent
  const isLegacyiPad =
    /iPad/.test(navigator.userAgent) ||
    (navigator.platform === "iPhone" && navigator.maxTouchPoints > 1);

  if (isModerniPad || isLegacyiPad) {
    document.documentElement.classList.add("is-ipad");
    document.body.classList.add("is-ipad");
  }
}

// Run detection before React renders
detectiPad();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
