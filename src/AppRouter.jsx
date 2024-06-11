import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import OnlinePlay from "./pages/OnlinePlay";
import PlayComputer from "./pages/PlayComputer";
import TwoPlayer from "./pages/TwoPlayer";
import Navbar from "./components/navigation/Navbar";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/online-play" element={<OnlinePlay />} />
        <Route path="/play-computer" element={<PlayComputer />} />
        <Route path="/two-player" element={<TwoPlayer />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
