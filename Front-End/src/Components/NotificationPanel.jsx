/* eslint-disable react/prop-types */
import { useState } from "react";
import moment from "moment";
import { useUpdateNotificationStatusMutation } from "../Store";
import { GoBell } from "react-icons/go";

const NotificationPanel = ({ notifications, setNotifications }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();

  const updateNotification = (newNotification) => {
    updateNotificationStatus(newNotification?.id);
    setNotifications((prevNotification) =>
      prevNotification.map((notification) =>
        notification?.id === newNotification?.id
          ? { ...notification, is_read: 1 }
          : notification
      )
    );
  };

  const handleNotificationClick = (notification) => {
    // Handle click for a specific notification
    notification.status = 1;
    updateNotification(notification);
    console.log("Notification clicked:", notification);
  };
  return (
    <div className="">
      <GoBell
        className="text-2xl font-bold"
        onClick={() => setShowPanel(!showPanel)}
      />
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full"
        
      >
        {showPanel ? 'Close Notifications' : 'Open Notifications'}
      </button> */}

      {showPanel && (
        <div className="fixed top-14 right-20 bg-white border border-gray-300 shadow-lg rounded p-4">
          <h2 className="text-xl mb-2 text-gray-800">Notifications</h2>
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification?.id}
                className={`mb-4 ${
                  notification?.is_read ? "bg-green-200" : "bg-red-200"
                } p-3 rounded`}
                onClick={() => handleNotificationClick(notification)}
                title={moment(notification?.timestamp).fromNow()}
              >
                <h3 className="text-lg mb-1">{notification?.type}</h3>
                <p className="text-sm text-gray-700 mb-1">
                  {notification?.content}
                </p>
                <p className="text-xs text-gray-500">
                  {notification?.created_at}
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
