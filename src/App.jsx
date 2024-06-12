import { Outlet } from "react-router-dom";
import Navbar from "./components/navigation/Navbar";
import "./index.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default App;
