import { Button } from "@/components/ui/button";

import { useDispatch } from "react-redux";
import { logoutUser } from "@/actions/userActions";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="h-full w-full p-2">
      <div className="border-[1px] border-secondary h-full w-full rounded-md p-2">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Settings;
