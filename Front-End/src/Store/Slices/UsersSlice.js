import { createSlice } from "@reduxjs/toolkit";
import { FatchUsers } from "../Thunk/FatchUsers";
import { RegisterUser } from "../Thunk/RegisterUser";

const UsersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    isPending: false,
    error: null,
  },
  extraReducers(builder) {
    // GET ALL USERS
    builder.addCase(FatchUsers.pending, (state, action) => {
      state.isPending = true;
      action.type; // just to avoid error message
    });
    builder.addCase(FatchUsers.fulfilled, (state, action) => {
      state.isPending = false;
      state.data = action.payload;
    });
    builder.addCase(FatchUsers.rejected, (state, action) => {
      state.isPending = false;
      state.error = action.error;
    });

    // REGISTER AN USERS
    builder.addCase(RegisterUser.pending, (state, action) => {
      state.isPending = true;
      action.type; // just to avoid error message
    });
    builder.addCase(RegisterUser.fulfilled, (state, action) => {
      state.isPending = false;
      state.data.push(action.payload);
    });
    builder.addCase(RegisterUser.rejected, (state, action) => {
      state.isPending = false;
      state.error = action.error;
    });
  },
});

export const usersReducer = UsersSlice.reducer;
