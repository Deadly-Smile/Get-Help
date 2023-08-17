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

const PostsAPI = createApi({
  reducerPath: "posts",
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
      getPosts: builder.query({
        // eslint-disable-next-line no-unused-vars
        providesTags: (_result, _error, _arg) => {
          const tags = [{ type: "posts" }];
          return tags;
        },
        query: () => "/posts",
      }),
      addPost: builder.mutation({
        // eslint-disable-next-line no-unused-vars
        invalidatesTags: (_result, _error, _arg) => {
          return [{ type: "posts" }];
        },
        query: ({ title, content }) => {
          return {
            url: "/add-post",
            body: { title, content },
            method: "POST",
          };
        },
      }),
    };
  },
});

export const { useGetPostsQuery, useAddPostMutation } = PostsAPI;

export { PostsAPI };
