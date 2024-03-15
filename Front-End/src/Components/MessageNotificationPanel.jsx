/* eslint-disable react/prop-types */
import { useContext } from "react";
import moment from "moment";
import { GoMail } from "react-icons/go";
import { useUpdateNotificationStatusMutation } from "../Store";
import MsgListContext from "../Context/MsgListContext";

const MessageNotificationPanel = ({
  notifications,
  setNotifications,
  indicator,
  setIndicator,
}) => {
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();
  const { addMsgPanel } = useContext(MsgListContext);

  const updateNotification = (newNotification) => {
    updateNotificationStatus({ noti_id: newNotification.id });
    setNotifications((prevNotification) =>
      prevNotification.map((notification) =>
        notification?.id === newNotification?.id
          ? { ...notification, is_read: 1 }
          : notification
      )
    );
    setIndicator(() => {
      return notifications?.some(
        (notification) =>
          notification.is_read === 0 && newNotification?.id !== notification.id
      );
    });
    console.log(indicator);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="">
        <GoMail
          className="text-2xl font-bold"
          // role="button"
          // onClick={() => setShowPanel(!showPanel)}
          onClick={() => console.log(notifications)}
        />
        {indicator && (
          <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></div>
        )}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu-vertical p-2 shadow bg-base-100 rounded-box w-[280px] max-w-96 overflow-scroll"
      >
        {notifications?.length ? (
          notifications
            // .filter((notification) => notification?.type === "notification")
            .map((notification) => (
              <li
                key={notification?.id}
                className={`mb-4 ${
                  notification?.is_read
                    ? "bg-base-300 opacity-70"
                    : "bg-base-500"
                } p-3 rounded`}
                onClick={() => {
                  addMsgPanel({
                    userId: notification?.triggered_user_id,
                    username: notification?.triggered_username,
                    avater: notification?.triggered_user_avatar,
                  });
                  updateNotification(notification);
                }}
                title={moment(notification?.created_at).fromNow()}
              >
                <div className="flex">
                  <img
                    src={
                      notification?.triggered_user_avatar
                        ? `${import.meta.env.VITE_BACKEND_URL}${
                            notification?.triggered_user_avatar
                          }`
                        : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
                    }
                    alt={`${notification?.triggered_username}'s Avatar`}
                    className="rounded-3xl w-4 h-4 mt-1 mr-1"
                  />
                  <h3 className="">{notification?.triggered_username}</h3>
                </div>
                <p className="text-sm mb-1">{notification?.content}</p>
                <p className="text-xs">
                  {moment(notification?.created_at).fromNow()}
                </p>
              </li>
            ))
        ) : (
          <li>No new message</li>
        )}
        {/* <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li> */}
      </ul>
    </div>
    // <div>
    //   {/* <GoMail
    //     className="text-2xl font-bold"
    //     onClick={() => setShowPanel(!showPanel)}
    //   /> */}
    //   <div className="relative">
    //     <GoMail
    //       className="text-2xl font-bold"
    //       onClick={() => setShowPanel(!showPanel)}
    //     />
    //     {indicator && (
    //       <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></div>
    //     )}
    //   </div>
    //   {/* <button
    //     className="bg-blue-500 text-white px-4 py-2 rounded-full"

    //   >
    //     {showPanel ? 'Close Notifications' : 'Open Notifications'}
    //   </button> */}

    //   {showPanel && (
    //     <div className="fixed top-14 right-20 w-[280px] max-h-[400px] overflow-y-auto bg-white border border-gray-300 shadow-lg rounded p-4">
    //       <h2 className="text-xl mb-2 text-gray-800">Messages</h2>
    //       <ul>
    //         {notifications
    //           // .filter((notification) => notification.type === "message")
    //           .map((notification) => {
    //             return (
    //               <li
    //                 key={notification?.id}
    //                 className={`mb-4 ${
    //                   notification?.is_read
    //                     ? "bg-gray-200 opacity-70"
    //                     : "bg-blue-200"
    //                 } p-3 rounded text-gray-800`}
    //                 onClick={() => {
    //                   addMsgPanel({
    //                     userId: notification?.triggered_user_id,
    //                     username: notification?.triggered_username,
    //                     avater: notification?.triggered_user_avatar,
    //                   });
    //                   updateNotification(notification);
    //                 }}
    //                 title={moment(notification?.created_at).fromNow()}
    //               >
    //                 <div className="flex">
    //                   <img
    //                     src={
    //                       notification?.triggered_user_avatar
    //                         ? `${import.meta.env.VITE_BACKEND_URL}${
    //                             notification?.triggered_user_avatar
    //                           }`
    //                         : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
    //                     }
    //                     alt={`${notification?.triggered_username}'s Avatar`}
    //                     className="rounded-3xl w-4 h-4 mt-1 mr-1"
    //                   />
    //                   <h3 className="">{notification?.triggered_username}</h3>
    //                 </div>
    //                 <p className="text-sm text-gray-700 mb-1">
    //                   {notification?.content}
    //                 </p>
    //                 <p className="text-xs text-gray-500">
    //                   {moment(notification?.created_at).fromNow()}
    //                 </p>
    //               </li>
    //             );
    //           })}
    //       </ul>
    //       {/* <p className="text-gray-800">{notifications[0].content}</p> */}
    //     </div>
    //   )}
    // </div>
  );
};

export default MessageNotificationPanel;
