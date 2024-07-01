// userActions.js

const BASE_URL =
  (process.env.NODE_ENV === "production" && process.env.BASE_URL) ||
  "https://chess-api-server.onrender.com";

import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  SIGNUP_USER_REQUEST,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "@/constants/userContstants";

import { jwtDecode } from "jwt-decode";

export const fetchUser = (token) => async (dispatch) => {
  dispatch({ type: FETCH_USER_REQUEST });

  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user.id;

    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    console.log("Fetched user data:", userData);

    dispatch({
      type: FETCH_USER_SUCCESS,
      payload: userData,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      payload: { error: error.message },
    });
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    const { token } = data;

    localStorage.setItem("token", token);

    const decodedToken = jwtDecode(token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token, user: decodedToken.user },
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: { error: error.message },
    });
  }
};

export const signupUser = (username, email, password) => async (dispatch) => {
  dispatch({ type: SIGNUP_USER_REQUEST });

  try {
    const response = await fetch(`${BASE_URL}/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({
        type: SIGNUP_USER_SUCCESS,
        payload: { userId: data.id, userData: data },
      });

      dispatch(loginUser(email, password));
    } else {
      dispatch({
        type: SIGNUP_USER_FAILURE,
        payload: { error: data.message },
      });
    }
  } catch (error) {
    dispatch({
      type: SIGNUP_USER_FAILURE,
      payload: { error: error.message },
    });
  }
};

export const fetchUserDetails = (token) => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await response.json();

    if (response.ok) {
      dispatch({ type: FETCH_USER_SUCCESS, payload: userData });
    } else {
      dispatch({ type: "FETCH_USER_FAILURE", payload: userData.message });
    }
  } catch (error) {
    dispatch({ type: "FETCH_USER_FAILURE", payload: error.message });
  }
};

export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("token");

  // Dispatch LOGOUT action
  dispatch({ type: LOGOUT });
};
