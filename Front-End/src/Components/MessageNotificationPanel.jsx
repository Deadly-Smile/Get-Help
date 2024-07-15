/* eslint-disable react/prop-types */
import { useContext } from "react";
import moment from "moment";
import { GoMail } from "react-icons/go";
// import { useUpdateNotificationStatusMutation } from "../Store";
import MsgListContext from "../Context/MsgListContext";

const MessageNotificationPanel = ({
  notifications,
  // setNotifications,
  indicator,
  // setIndicator,
}) => {
  // const [updateNotificationStatus] = useUpdateNotificationStatusMutation();
  // const { addMsgPanel } = useContext(MsgListContext);

  // const updateNotification = (newNotification) => {
  //   updateNotificationStatus({ noti_id: newNotification.id });
  //   setNotifications((prevNotification) =>
  //     prevNotification.map((notification) =>
  //       notification?.id === newNotification?.id
  //         ? { ...notification, is_read: 1 }
  //         : notification
  //     )
  //   );
  //   setIndicator(() => {
  //     return notifications?.some(
  //       (notification) =>
  //         notification.is_read === 0 && newNotification?.id !== notification.id
  //     );
  //   });
  // };

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
      {/* <ul
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
                  // updateNotification(notification);
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
      </ul> */}
    </div>
  );
};

export default MessageNotificationPanel;
