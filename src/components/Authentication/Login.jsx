import React, { useState } from "react";
import image from "/images/q1.jpg";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/actions/userActions";

import useWindowDimensions from "@/hooks/useWindowDimensions";

const Login = () => {
  const { width } = useWindowDimensions();
  return (
    <div className="p-2 w-full h-full flex">
      <div className="w-full h-full rounded-l-sm border-[1px] md:border-r-transparent border-secondary flex items-center justify-center p-16">
        <LoginForm />
      </div>
      {
        width >= 1024 &&
        <div className="flex relative w-full h-full rounded-r-sm overflow-hidden border-r-[1px] border-secondary border-t-[1px] border-b-[1px]">
          <img src={image} alt="queen" className="w-full h-full object-cover" />
          <div className="absolute h-full w-full z-10 bg-gradient-to-r from-background to-[#0000000e]" />
        </div>
      }
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
    console.log(token);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center flex-col w-full gap-4">
      <h1 className="font-semibold text-3xl">Login</h1>
      <form className="flex flex-col gap-2" onSubmit={handleLogin}>
        <label htmlFor="email" className="w-full">
          Email
        </label>
        <input
          type="email"
          className="w-72 rounded-sm bg-background border-secondary border-[1px] p-2 outline-primary"
          placeholder="abc@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="w-full">
          Password
        </label>
        <input
          type="password"
          className="w-72 rounded-sm bg-background border-secondary border-[1px] p-2 outline-primary"
          placeholder="jn8&88:[/ug"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <h1>Dont have an account?</h1>
        <Button variant="link" onClick={() => navigate("/signup")}>
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default Login;
