// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import gameReducer from "./reducers/gameReducer";
// Import other reducers as needed

const store = configureStore({
  reducer: {
    user: userReducer,
    game: gameReducer,
    // Add other reducers here
  },
  // If you want to add custom middleware, you can do it like this:
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(customMiddleware),
  // To disable serializableCheck and other default middleware settings:
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production", // Enables Redux DevTools Extension in development
});

export default store;
