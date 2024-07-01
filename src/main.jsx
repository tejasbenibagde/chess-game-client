// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store";
import { ThemeProvider } from "./ThemeProvider";
import Dashboard from "./Dashboard"; // Import the new AppRoutes component
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/errors/ErrorBoundary";

const root = createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ErrorBoundary>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  </Provider>
  // </React.StrictMode>
);
