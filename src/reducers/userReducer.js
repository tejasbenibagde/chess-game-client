// userReducer.js

import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  SET_TOKEN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "@/constants/userContstants";

const initialState = {
  userDetails: null,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        userDetails: action.payload,
        error: null,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        userDetails: action.payload.user,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        userDetails: null,
        token: null,
        error: null,
      };
    default:
      return state;
  }
};

export default userReducer;
