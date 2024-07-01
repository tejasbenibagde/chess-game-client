// src/AppRoutes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import your pages
import OnlinePlay from "./pages/OnlinePlay";
import PlayComputer from "./pages/PlayComputer";
import TwoPlayer from "./pages/TwoPlayer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import GameList from "./pages/GameList";
const AppRoutes = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route
        path="/online-play"
        element={
          <ProtectedRoute>
            <OnlinePlay />
          </ProtectedRoute>
        }
      />
      <Route path="/play-computer" element={<PlayComputer />} />
      <Route path="/two-player" element={<TwoPlayer />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/games/:id" element={<GameList />} />
    </Routes>
  );
};

export default AppRoutes;
