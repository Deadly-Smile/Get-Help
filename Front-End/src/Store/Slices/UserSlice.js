import { createSlice } from "@reduxjs/toolkit";
import { RegisterUser } from "../Thunk/RegisterUser";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    isLogedIn: false,
    email: "",
  },
  extraReducers(builder) {
    builder.addCase(RegisterUser.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    });
  },
});

export const userReducer = UserSlice.reducer;
