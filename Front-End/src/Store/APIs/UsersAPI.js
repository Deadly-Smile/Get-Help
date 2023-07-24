/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAuthToken = () => {
  let token = "";
  try {
    token = localStorage.getItem("login_token");
  } catch (error) {
    console.log("token not found");
  }
  return token;
};

const UsersAPI = createApi({
  reducerPath: "users",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
    prepareHeaders: (headers) => {
      // Add the authentication token to the request headers
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      getUser: builder.query({
        providesTags: (result, error, arg) => {
          console.log("getUser");
          const tags = [{ type: "user" }];
          return tags;
        },
        query: () => "/user",
      }),
      addUser: builder.mutation({
        query: ({ username, name, email, password, password_confirmation }) => {
          return {
            url: "/users",
            body: {
              username,
              name,
              email,
              password,
              password_confirmation,
            },
            method: "POST",
          };
        },
      }),
      logout: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          console.log("logout", result);
          localStorage.setItem("login_token", "");
          return [{ type: "user" }];
        },
        query: ({ message }) => {
          return {
            url: "/logout",
            body: {
              message,
            },
            method: "POST",
          };
        },
      }),
      signUpVerify: builder.mutation({
        invalidatesTags: (result, error, id) => {
          console.log("signUpVerify");
          return [{ type: "user" }];
        },
        query: ({ id, code }) => {
          return {
            url: `/${id}/signup/verify`,
            body: {
              code,
            },
            method: "PUT",
          };
        },
      }),
      login: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          console.log("login", result);
          localStorage.setItem("login_token", result.token);
          return [{ type: "user" }];
        },
        query: ({ username, password }) => {
          return {
            url: "/login",
            body: {
              username,
              password,
            },
            method: "POST",
          };
        },
      }),
    };
  },
});

export const {
  useGetUserQuery,
  useLogoutMutation,
  useAddUserMutation,
  useSignUpVerifyMutation,
  useLoginMutation,
} = UsersAPI;
export { UsersAPI };
