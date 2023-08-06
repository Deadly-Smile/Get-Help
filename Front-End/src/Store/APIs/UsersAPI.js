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
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api`,
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
      editUser: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "user" }];
        },
        query: (formDataToSend) => {
          console.log(formDataToSend);
          return {
            url: "/edit-user",
            body: formDataToSend,
            method: "POST",
          };
        },
      }),
      applyAdmin: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "user" }];
        },
        query: (formDataToSend) => {
          console.log(formDataToSend);
          return {
            url: "/apply-admin",
            body: formDataToSend,
            method: "POST",
          };
        },
      }),
    };
  },
});

export const {
  useGetUserQuery,
  useApplyAdminMutation,
  useEditUserMutation,
  useLogoutMutation,
  useAddUserMutation,
  useSignUpVerifyMutation,
  useLoginMutation,
} = UsersAPI;
export { UsersAPI };
