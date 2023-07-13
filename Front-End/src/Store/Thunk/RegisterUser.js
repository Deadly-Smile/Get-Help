import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const RegisterUser = createAsyncThunk(
  "users/register",
  async ({ username, name, email, password, password_confirmation }) => {
    console.log(username, name, email, password, password_confirmation);
    return await axios.post("http://127.0.0.1:8000/api/users", {
      username,
      name,
      email,
      password,
      password_confirmation,
    });
  }
);

export { RegisterUser };
