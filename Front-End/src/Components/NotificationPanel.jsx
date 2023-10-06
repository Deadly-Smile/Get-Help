/* eslint-disable react/prop-types */
import { useState } from "react";
import moment from "moment";
import { useUpdateNotificationStatusMutation } from "../Store";
import { GoBell } from "react-icons/go";

const NotificationPanel = ({
  notifications,
  setNotifications,
  indicator,
  setIndicator,
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();

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
      return notifications?.some((notification) => notification.is_read === 0);
    });
  };
  return (
    <div className="">
      {/* <GoBell
        className="text-2xl font-bold"
        onClick={() => setShowPanel(!showPanel)}
      /> */}
      <div className="relative">
        <GoBell
          className="text-2xl font-bold"
          onClick={() => setShowPanel(!showPanel)}
        />
        {indicator && (
          <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></div>
        )}
      </div>
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full"
        
      >
        {showPanel ? 'Close Notifications' : 'Open Notifications'}
      </button> */}

      {showPanel && (
        <div className="fixed top-14 right-20 min-w-[280px] max-h-[400px] overflow-y-auto bg-white border border-gray-300 shadow-lg rounded p-4">
          <h2 className="text-xl mb-2 text-gray-800">Notifications</h2>
          <ul>
            {notifications
              // .filter((notification) => notification?.type === "notification")
              .map((notification) => (
                <li
                  key={notification?.id}
                  className={`mb-4 ${
                    notification?.is_read
                      ? "bg-gray-200 opacity-70"
                      : "bg-blue-200"
                  } p-3 rounded text-gray-800`}
                  onClick={() => updateNotification(notification)}
                  title={moment(notification?.created_at).fromNow()}
                >
                  <h3 className="text-lg mb-1">{notification?.type}</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    {notification?.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {moment(notification?.created_at).fromNow()}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
