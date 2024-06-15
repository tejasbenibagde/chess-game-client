// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router";

import { ThemeProvider } from "./ThemeProvider";

// Routes
import OnlinePlay from "./pages/OnlinePlay";
import PlayComputer from "./pages/PlayComputer";
import TwoPlayer from "./pages/TwoPlayer";
import Home from "./pages/Home";

const root = createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <Routes>
        <Route index={true} path="/" element={<Home />} />
        <Route path="/online-play" element={<OnlinePlay />} />
        <Route path="/play-computer" element={<PlayComputer />} />
        <Route path="/two-player" element={<TwoPlayer />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  // </React.StrictMode>
);
