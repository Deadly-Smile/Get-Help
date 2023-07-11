import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "./Slices/UsersSlice";

export const Store = configureStore({
  reducer: {
    users: usersReducer,
  },
});
export * from "./Thunk/FatchUsers";
export * from "./Thunk/RegisterUser";
