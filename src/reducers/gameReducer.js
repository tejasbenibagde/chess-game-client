// src/reducers/gameReducer.js
const initialState = {
  games: [],
  loading: false,
  error: null,
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_GAMES_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_GAMES_SUCCESS":
      return {
        ...state,
        loading: false,
        games: action.payload,
      };
    case "FETCH_GAMES_FAILURE":
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
