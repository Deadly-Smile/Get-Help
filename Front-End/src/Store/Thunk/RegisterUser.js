import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const RegisterUser = createAsyncThunk(
  "users/register",
  async ({ name, email, password }) => {
    const responce = await axios
      .post("http://127.0.0.1:8000/api/users", { name, email, password })
      .then((responce) => {
        return responce.data;
      })
      .catch((error) => {
        console.log(error.message);
      });

    return responce.data;
  }
);

export { RegisterUser };
