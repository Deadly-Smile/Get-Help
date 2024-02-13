/* eslint-disable react/prop-types */
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import NotificationPanel from "./NotificationPanel";
import MessageNotificationPanel from "./MessageNotificationPanel";
import {
  requestNotificationPermission,
  displayNotification,
} from "../Hooks/PushNotificationsHooks";

const NavConfig = ({ data }) => {
  const [notifications, setNotifications] = useState(
    data?.notifications?.filter(
      (notification) => notification.type === "notification"
    )
  );
  const [messagesNotification, setMessageNotification] = useState(
    data?.notifications?.filter(
      (notification) => notification.type === "message"
    )
  );
  const [messageIndicator, setMessageIndicator] = useState(() => {
    return messagesNotification?.some(
      (notification) => notification.is_read === 0
    );
  });
  const [othNotificationIndecator, setOthNotificationIndecator] = useState(
    () => {
      return notifications?.some((notification) => notification.is_read === 0);
    }
  );

  useEffect(() => {
    setNotifications(
      data?.notifications?.filter(
        (notification) => notification.type === "notification"
      )
    );
    setMessageNotification(
      data?.notifications?.filter(
        (notification) => notification.type === "message"
      )
    );
    setMessageIndicator(() => {
      return messagesNotification?.some(
        (notification) => notification.is_read === 0
      );
    });

    setOthNotificationIndecator(() => {
      return notifications?.some((notification) => notification.is_read === 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.notifications]);

  useEffect(() => {
    if (data?.user?.id) {
      requestNotificationPermission();
      const usePusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_CLUSTER,
        encrypted: true,
        channelAuthorization: {
          endpoint: `${import.meta.env.VITE_BACKEND_URL}/api/pusher/auth`,
          headers: {
            authorization: `Bearer ${localStorage.getItem("login_token")}`,
          },
        },
      });
      const channel = usePusher.subscribe(`notifications.${data?.user?.id}`);
      channel.bind("new-notification", (data) => {
        setNotifications([data.notification, ...notifications]);
        displayNotification("New Notification", {
          body: data.notification.content,
        });
      });

      channel.bind("new-message", (data) => {
        setMessageNotification((prevMessages) => [
          data.notification,
          ...prevMessages,
        ]);
        setMessageIndicator(true);
        displayNotification(`New Message`, {
          body: data.notification.content,
        });
      });

      return () => {
        channel.unbind(`notifications.${data?.user?.id}`);
      };
    }
  }, [data, notifications]);
  const [activeNavLinks, setActiveNavLinks] = useState([
    { label: "About", link: "/about" },
    { label: "Log in", link: "/login" },
    { label: "Sign up", link: "/signup" },
  ]);

  const [parentList, setParentList] = useState([]);
  const [manageList, setManageList] = useState([]);

  useEffect(() => {
    let defaultNavLink = [
      { label: "About", link: "/about" },
      { label: "Log in", link: "/login" },
      { label: "Sign up", link: "/signup" },
    ];

    if (data && data.user) {
      const parentLinkList = [
        { label: data.user.username, link: `/home/get-user/${data.user.id}` },
        { label: "Log out", link: "/logout" },
      ];
      const manageLinkList = [];
      const navLinkWithPermission = [
        { label: "About", link: "/about" },
        {
          label: (
            <NotificationPanel
              notifications={notifications}
              setNotifications={setNotifications}
              indicator={othNotificationIndecator}
              setIndicator={setOthNotificationIndecator}
            />
          ),
          link: "#",
        },
        {
          label: (
            <MessageNotificationPanel
              notifications={messagesNotification}
              setNotifications={setMessageNotification}
              indicator={messageIndicator}
              setIndicator={setMessageIndicator}
            />
          ),
          link: "#",
        },
      ];

      if (data.permission.includes("edit-my-post")) {
        parentLinkList.splice(1, 0, { label: "Posts", link: "post-table" });
        // navLinkWithPermission.splice(1, 0, { label: "Posts", link: "#" });
      }

      if (data.permission.includes("edit-user-table")) {
        manageLinkList.push({ label: "Users", link: "/home/user-table" });
        // navLinkWithPermission.splice(1, 0, {
        //   label: "Users",
        //   link: "/home/user-table",
        // });
      }

      if (data.permission.includes("edit-post-table")) {
        manageLinkList.push({
          label: "Posts",
          link: "/home/post-table",
        });
      }
      if (data.permission.includes("make-available-recharge-token")) {
        manageLinkList.push({
          label: "Tokens",
          link: "/home/token-table",
        });
      }

      if (data.permission.includes("edit-doctor-table")) {
        manageLinkList.push({ label: "Doctors", link: "/home/doctor-table" });
        // navLinkWithPermission.splice(1, 0, {
        //   label: "Doctors",
        //   link: "/home/doctor-table",
        // });
      }

      if (data.permission.includes("edit-admin-table")) {
        manageLinkList.push({ label: "Admins", link: "/home/admin-table" });
        // navLinkWithPermission.splice(1, 0, {
        //   label: "Admins",
        //   link: "/home/admin-table",
        // });
      }

      if (data.permission.includes("create-post")) {
        parentLinkList.splice(1, 0, {
          label: "Create Post",
          link: "/home/create-post",
        });
        // navLinkWithPermission.splice(1, 0, {
        //   label: "Create Post",
        //   link: "/home/create-post",
        // });
      }
      setActiveNavLinks(navLinkWithPermission);
      setManageList(manageLinkList);
      setParentList(parentLinkList);
    } else {
      setActiveNavLinks(defaultNavLink);
    }
  }, [
    data,
    messageIndicator,
    messagesNotification,
    notifications,
    othNotificationIndecator,
  ]);
  return (
    <Navbar
      linkList={activeNavLinks}
      parentLinkList={parentList}
      manageLinkList={manageList}
      userName={data?.user?.username}
    />
  );
};

export default NavConfig;
