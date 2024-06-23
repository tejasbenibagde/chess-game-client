// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store";
import { ThemeProvider } from "./ThemeProvider";
import Dashboard from "./Dashboard"; // Import the new AppRoutes component

const root = createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Dashboard /> {/* Use the AppRoutes component */}
    </ThemeProvider>
  </Provider>
  // </React.StrictMode>
);
