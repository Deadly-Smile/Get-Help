import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const FatchUsers = createAsyncThunk("users/fatch", async () => {
  return await axios
    .get("http://127.0.0.1:8000/api/users")
    .then((responce) => {
      return responce.data;
    })
    .catch((error) => {
      console.log(error.message);
    });
});

export { FatchUsers };
