import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

console.log(
  "%cSTOP! 🛑",
  "font-size: 32px; font-weight: 800; color: #ef4444;"
);
console.log(
  "%cYou're looking at the console. You're a dev. I'm looking for a job.",
  "font-size: 14px; color: #e5e7eb;"
);
console.log(
  "%cTry pressing Cmd+K ;)",
  "font-size: 14px; color: #4ade80;"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
