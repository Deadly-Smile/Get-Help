import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { UsersAPI } from "./APIs/UsersAPI";
import { PostsAPI } from "./APIs/PostsAPI";

export const Store = configureStore({
  reducer: {
    // not an array, just a bracket notation
    [UsersAPI.reducerPath]: UsersAPI.reducer,
    [PostsAPI.reducerPath]: PostsAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(UsersAPI.middleware)
      .concat(PostsAPI.middleware);
  },
});
setupListeners(Store.dispatch);
export {
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
} from "./APIs/UsersAPI";

export {
  useGetPostsQuery,
  useAddPostMutation,
  useVotePostMutation,
  useAddCommentMutation,
  useGetThePostQuery,
  useGetPendingPostsQuery,
  useDeletePendingPostMutation,
  useApprovePostMutation,
} from "./APIs/PostsAPI";
