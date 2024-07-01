// src/reducers/gameReducer.js

const initialState = {
  games: [],
  gamesByUser: {},
  loading: false,
  error: null,
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_GAMES_REQUEST":
    case "FETCH_GAMES_BY_USER_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_GAMES_SUCCESS":
      return {
        ...state,
        loading: false,
        games: action.payload,
      };
    case "FETCH_GAMES_BY_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        gamesByUser: {
          ...state.gamesByUser,
          [action.payload.userId]: action.payload.games,
        },
      };
    case "FETCH_GAMES_FAILURE":
    case "FETCH_GAMES_BY_USER_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default gameReducer;
