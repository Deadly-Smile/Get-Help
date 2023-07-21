import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAuthToken = () => {
  return process.env.REACT_APP_YOUR_AUTHENTICATION_TOKEN;
};

const UsersAPI = createApi({
  reducerPath: "users",
  prepareHeaders: (headers) => {
    // Add the authentication token to the request headers
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
    prepareHeaders: (headers) => {
      // Get the access token
      const accessToken = localStorage.getItem("login_token");

      // Add the 'Authorization' header with the access token
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
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
    };
  },
});

export const {
  useGetUserQuery,
  useAddUserMutation,
  useSignUpVerifyMutation,
  useLoginMutation,
} = UsersAPI;
export { UsersAPI };
