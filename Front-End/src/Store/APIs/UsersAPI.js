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
      getAllUsers: builder.query({
        providesTags: (result, error, arg) => {
          const tags = [{ type: "all-users" }];
          return tags;
        },
        query: ({ currentPage, usersPerPage }) => {
          let perPage = 8;
          if (usersPerPage) perPage = usersPerPage;
          return `get-users?page=${currentPage}&perPage=${perPage}`;
        },
      }),
      getAllAdmins: builder.query({
        providesTags: (result, error, arg) => {
          const tags = [{ type: "all-users" }];
          return tags;
        },
        query: ({ currentPage, adminsPerPage }) => {
          let perPage = 8;
          if (adminsPerPage) perPage = adminsPerPage;
          return `get-admins?page=${currentPage}&perPage=${perPage}`;
        },
      }),
      getAllDoctors: builder.query({
        providesTags: (result, error, arg) => {
          const tags = [{ type: "all-users" }];
          return tags;
        },
        query: ({ currentPage, doctorsPerPage }) => {
          let perPage = 8;
          if (doctorsPerPage) perPage = doctorsPerPage;
          return `get-doctors?page=${currentPage}&perPage=${perPage}`;
        },
      }),
      deleteUser: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "all-users" }];
        },
        query: ({ id }) => {
          return {
            url: `/delete-user/${id}`,
            method: "DELETE",
          };
        },
      }),
      approveAdmin: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "all-users" }];
        },
        query: ({ id }) => {
          return {
            url: `/approve-admin/${id}`,
            method: "POST",
          };
        },
      }),
      disproveAdmin: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "all-users" }];
        },
        query: ({ id }) => {
          return {
            url: `/disprove-admin/${id}`,
            method: "POST",
          };
        },
      }),
      getUserByID: builder.query({
        query: ({ id }) => {
          return `user/${id}`;
        },
      }),
      getUserByUsername: builder.mutation({
        query: ({ username }) => {
          return {
            url: `username:${username}`,
            method: "GET",
          };
        },
      }),
      approveDoctor: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "all-users" }];
        },
        query: ({ id }) => {
          return {
            url: `/approve-doctor/${id}`,
            method: "POST",
          };
        },
      }),
      disproveDoctor: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "all-users" }];
        },
        query: ({ id }) => {
          return {
            url: `/disprove-doctor/${id}`,
            method: "POST",
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
      logout: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          localStorage.setItem("login_token", "");
          const tags = [{ type: "user" }];
          return tags;
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
          return {
            url: "/apply-admin",
            body: formDataToSend,
            method: "POST",
          };
        },
      }),
      getMessages: builder.query({
        providesTags: (result, error, arg) => {
          const tags = [{ type: "message", receiverId: arg.receiver }];
          return tags;
        },
        query: ({ receiver, sender }) => `/messages/${receiver}/${sender}`,
      }),
      sendMessage: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "message", receiverId: arg.receiver }];
        },
        query: ({ receiver, sender, content }) => {
          return {
            url: `/message-send`,
            body: { content, receiver, sender },
            method: "POST",
          };
        },
      }),
      updateMsgStatus: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "message", receiverId: arg.senderId }];
        },
        query: ({ senderId, messageId }) => {
          return {
            url: `/message/update/status`,
            body: { senderId, messageId },
            method: "POST",
          };
        },
      }),
      updateNotificationStatus: builder.mutation({
        query: ({ noti_id }) => {
          return {
            url: `/notification/seen`,
            body: { noti_id },
            method: "POST",
          };
        },
      }),
      getRechargeTokens: builder.query({
        providesTags: (result, error, arg) => {
          const tags = [{ type: "token" }];
          return tags;
        },
        query: ({ currentPage, perPage }) => {
          if (!perPage) perPage = 20;
          return {
            url: `/get-recharge-token?page=${currentPage}&perPage=${perPage}`,
          };
        },
      }),
      createRechargeToken: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "token" }];
        },
        query: ({ value, handler }) => {
          console.log(value, handler);
          return {
            url: `/create/recharge-token`,
            body: { value, handler },
            method: "POST",
          };
        },
      }),
      deleteRechargeToken: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "token" }];
        },
        query: ({ id }) => {
          return {
            url: `/delete-recharge-token/${id}`,
            method: "GET",
          };
        },
      }),
      assignTokenToAdmin: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "token" }];
        },
        query: ({ id, adminName }) => {
          return {
            url: `/assign-recharge-token/${id}`,
            body: { username: adminName },
            method: "POST",
          };
        },
      }),
      addMoney: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "user" }];
        },
        query: ({ token }) => {
          return {
            url: `/use-recharge-token`,
            body: { token },
            method: "POST",
          };
        },
      }),
      donateTo: builder.mutation({
        invalidatesTags: (result, error, arg) => {
          return [{ type: "user" }];
        },
        query: ({ amount, id }) => {
          return {
            url: `/donate/to_${id}`,
            body: { amount },
            method: "POST",
          };
        },
      }),
      getContacts: builder.query({
        providesTags: (result, error, arg) => {
          const tags = [{ type: "contacts" }];
          return tags;
        },
        query: () => {
          return "/get-contacts";
        },
      }),
    };
  },
});

export const {
  useGetUserQuery,
  useGetAllUsersQuery,
  useGetAllDoctorsQuery,
  useGetAllAdminsQuery,
  useApproveAdminMutation,
  useDisproveAdminMutation,
  useApproveDoctorMutation,
  useDisproveDoctorMutation,
  useDeleteUserMutation,
  useApplyAdminMutation,
  useEditUserMutation,
  useLogoutMutation,
  useAddUserMutation,
  useSignUpVerifyMutation,
  useLoginMutation,
  useGetUserByIDQuery,
  useGetUserByUsernameMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateMsgStatusMutation,
  useUpdateNotificationStatusMutation,
  useGetRechargeTokensQuery,
  useDeleteRechargeTokenMutation,
  useCreateRechargeTokenMutation,
  useAssignTokenToAdminMutation,
  useAddMoneyMutation,
  useDonateToMutation,
  useGetContactsQuery,
} = UsersAPI;
export { UsersAPI };
