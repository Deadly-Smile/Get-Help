import { configureStore } from "@reduxjs/toolkit";
// import { usersReducer } from "./Slices/UsersSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { UsersAPI } from "./APIs/UsersAPI";

export const Store = configureStore({
  reducer: {
    // not an array, just a bracket notation
    [UsersAPI.reducerPath]: UsersAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(UsersAPI.middleware);
  },
});
setupListeners(Store.dispatch);
export * from "./Thunk/FatchUsers";
export * from "./Thunk/RegisterUser";
export { useFetchUsersQuery } from "./APIs/UsersAPI";
