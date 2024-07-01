import React, { useState } from "react";
import image from "/images/q2.jpg";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "@/actions/userActions";

import useWindowDimensions from "@/hooks/useWindowDimensions";

const Signup = () => {
  const { width } = useWindowDimensions();
  return (
    <div className="p-2 w-full h-full flex">
      <div className=" w-full h-full rounded-l-sm border-[1px] md:border-r-transparent border-secondary flex items-center justify-center p-16">
        <SignupForm />
      </div>
      {
        width >= 1024 &&
        <div className="flex relative w-full h-full rounded-r-sm overflow-hidden border-r-[1px] border-secondary border-t-[1px] border-b-[1px]">
          <img src={image} alt="queen" className="w-full h-full object-cover" />
          <div className="absolute h-full w-full z-10 bg-gradient-to-r from-background to-[#00000008]" />
        </div>
      }
    </div>
  );
};

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password should be at least 8 characters long, contain a number and a special character.";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validationMessage = validatePassword(newPassword);
    setPasswordError(validationMessage);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const validationMessage = validatePassword(password);
    if (validationMessage) {
      setPasswordError(validationMessage);
      return;
    }
    dispatch(signupUser(username, email, password));
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center flex-col w-full gap-4">
      <h1 className="font-semibold text-3xl">Create Account</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSignup}>
        <label htmlFor="username" className="w-full">
          Username
        </label>
        <input
          type="text"
          className="w-72 rounded-sm bg-background border-secondary border-[1px] p-2 outline-primary"
          placeholder="e.g. yohanlibert"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
          onChange={handlePasswordChange}
        />
        {passwordError && <p className="text-red-500">{passwordError}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <div className="flex items-center justify-center flex-col md:flex-row">
        <h1>Already have an account?</h1>
        <Button variant="link" onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Signup;
