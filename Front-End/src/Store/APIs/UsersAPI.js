import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const UsersAPI = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),
  endpoints(builder) {
    return {
      fetchUsers: builder.query({
        query: () => {
          return {
            url: "/users",
            method: "GET",
          };
        },
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
  useFetchUsersQuery,
  useAddUserMutation,
  useSignUpVerifyMutation,
  useLoginMutation
} = UsersAPI;
export { UsersAPI };
