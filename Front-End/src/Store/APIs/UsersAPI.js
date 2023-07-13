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
    };
  },
});

export const { useFetchUsersQuery } = UsersAPI;
export { UsersAPI };
