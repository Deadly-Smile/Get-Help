import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAuthToken = () => {
  let token = "";
  try {
    token = localStorage.getItem("login_token");
  } catch (error) {
    console.log("token not found");
  }
  return token;
  // return import.meta.env.VITE_YOUR_AUTHENTICATION_TOKEN;
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
      signUpVerify: builder.mutation({
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
      logout: builder.query({
        query: () => {
          // localStorage.setItem("login_token", "");
          return {
            url: "/logout",
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useGetUserQuery,
  useAddUserMutation,
  useSignUpVerifyMutation,
  useLoginMutation,
  useLogoutQuery,
} = UsersAPI;
export { UsersAPI };
