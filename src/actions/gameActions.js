// src/actions/gameActions.js

const BASE_URL =
  (process.env.NODE_ENV === "production" && process.env.BASE_URL) ||
  "https://chess-api-server.onrender.com";

export const fetchGames = () => async (dispatch) => {
  dispatch({ type: "FETCH_GAMES_REQUEST" });
  try {
    const response = await fetch(`${BASE_URL}/api/games`);
    const data = await response.json();
    dispatch({ type: "FETCH_GAMES_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_GAMES_FAILURE", error });
  }
};

export const createGame = (game) => async (dispatch) => {
  dispatch({ type: "CREATE_GAME_REQUEST" });
  try {
    const response = await fetch(`${BASE_URL}/api/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });
    const data = await response.json();
    dispatch({ type: "CREATE_GAME_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "CREATE_GAME_FAILURE", error });
  }
};

export const fetchGamesByUserId = (id) => async (dispatch) => {
  dispatch({ type: "FETCH_GAMES_BY_USER_REQUEST" });
  try {
    const response = await fetch(`${BASE_URL}/api/games/user/${id}`);
    const data = await response.json();
    dispatch({ type: "FETCH_GAMES_BY_USER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_GAMES_BY_USER_FAILURE", error });
  }
};
