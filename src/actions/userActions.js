// src/actions/userActions.js
export const fetchUser = () => async (dispatch) => {
  dispatch({ type: "FETCH_USER_REQUEST" });
  try {
    const response = await fetch("/api/user");
    const data = await response.json();
    dispatch({ type: "FETCH_USER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_USER_FAILURE", error });
  }
};
