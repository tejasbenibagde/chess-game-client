// src/AppRoutes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import your pages
import OnlinePlay from "./pages/OnlinePlay";
import PlayComputer from "./pages/PlayComputer";
import TwoPlayer from "./pages/TwoPlayer";
import Home from "./pages/Home";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/online-play" element={<OnlinePlay />} />
        <Route path="/play-computer" element={<PlayComputer />} />
        <Route path="/two-player" element={<TwoPlayer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
