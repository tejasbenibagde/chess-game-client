// src/main.jsx
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom";

import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  createRoot(document.getElementById("root")).render(<App />)
);
