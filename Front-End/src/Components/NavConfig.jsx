import { GoMail } from "react-icons/go";
import Navbar from "./Navbar";
import { useContext, useEffect, useState } from "react";
import UserContext from "../Context/UserContext";
import Pusher from "pusher-js";
import NotificationPanel from "./NotificationPanel";

const NavConfig = () => {
  const { data, isSuccess } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (isSuccess) {
      setNotifications(data.notifications);
    }
  }, [data?.notifications, isSuccess]);

  useEffect(() => {
    if (data?.user && isSuccess) {
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
      channel.bind("new-message", (data) => {
        setNotifications([...notifications, data?.notification]);
      });

      return () => {
        // Unsubscribe from the Pusher channel when component unmounts
        channel.unbind(`notifications.${data?.user?.id}`);
      };
    }
  }, [notifications, data?.user, isSuccess]);
  const [activeNavLinks, setActiveNavLinks] = useState([
    { label: "About", link: "/about" },
    { label: "Log in", link: "/login" },
    { label: "Sign up", link: "/signup" },
  ]);

  useEffect(() => {
    let defaultNavLink = [
      { label: "About", link: "/about" },
      { label: "Log in", link: "/login" },
      { label: "Sign up", link: "/signup" },
    ];

    if (isSuccess && data && data.user) {
      const navLinkWithPermission = [
        { label: "About", link: "/about" },
        {
          label: (
            <NotificationPanel
              notifications={notifications}
              setNotifications={setNotifications}
            />
          ),
          link: "#",
        },
        {
          label: (
            <div className="">
              <GoMail className="text-2xl font-bold" />
            </div>
          ),
          link: "#",
        },
        { label: data.user.username, link: "/edit-profile" },
        { label: "Log out", link: "/logout" },
      ];

      if (data.permission.includes("edit-my-post")) {
        navLinkWithPermission.splice(1, 0, { label: "Posts", link: "#" });
      }

      if (data.permission.includes("edit-user-table")) {
        navLinkWithPermission.splice(1, 0, {
          label: "Users",
          link: "/user-table",
        });
      }

      if (data.permission.includes("edit-doctor-table")) {
        navLinkWithPermission.splice(1, 0, {
          label: "Doctors",
          link: "/doctor-table",
        });
      }

      if (data.permission.includes("edit-admin-table")) {
        navLinkWithPermission.splice(1, 0, {
          label: "Admins",
          link: "/admin-table",
        });
      }

      if (data.permission.includes("create-post")) {
        navLinkWithPermission.splice(1, 0, {
          label: "Create Post",
          link: "/create-post",
        });
      }

      setActiveNavLinks(navLinkWithPermission);
    } else {
      setActiveNavLinks(defaultNavLink);
    }
  }, [data, isSuccess, notifications]);
  return <Navbar linkList={activeNavLinks} />;
};

export default NavConfig;
