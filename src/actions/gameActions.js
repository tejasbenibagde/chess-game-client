// src/actions/gameActions.js
export const fetchGames = () => async (dispatch) => {
  dispatch({ type: "FETCH_GAMES_REQUEST" });
  try {
    const response = await fetch("/api/games");
    const data = await response.json();
    dispatch({ type: "FETCH_GAMES_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_GAMES_FAILURE", error });
  }
};
