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
          const tags = _result?.posts?.data?.map((post) => {
            return { type: "post", id: post.id };
          });
          return tags;
        },
        // get-doctors?page=${currentPage}&perPage=${perPage}
        query: (currentPage, perPage) => {
          if (!perPage) perPage = 10;
          return `/posts?page=${currentPage}&perPage=${perPage}`;
        },
      }),
      addComment: builder.mutation({
        invalidatesTags: (_result, _error, arg) => {
          return [{ type: "post", id: arg.id }];
        },
        query: ({ content, id }) => {
          return {
            url: `/add/comment/post/${id}`,
            body: { content },
            method: "POST",
          };
        },
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
      votePost: builder.mutation({
        // eslint-disable-next-line no-unused-vars
        invalidatesTags: (_result, _error, _arg) => {
          return [{ type: "posts" }];
        },
        query: ({ id, operation }) => {
          return {
            url: `/vote/post/${id}`,
            body: { id, type: operation },
            method: "POST",
          };
        },
      }),
    };
  },
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useVotePostMutation,
  useAddCommentMutation,
} = PostsAPI;

export { PostsAPI };
