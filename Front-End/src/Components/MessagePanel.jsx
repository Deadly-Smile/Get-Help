// src/Components/MessagePanel.jsx
import { useContext, useEffect, useState, useRef, useMemo } from "react";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateMsgStatusMutation,
} from "../Store";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaWindowMinimize } from "react-icons/fa";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import MsgListContext from "../Context/MsgListContext";
import ChattingContentPanel from "./ChattingContentPanel";
import Pusher from "pusher-js";
import LoadingContext from "../Context/LoadingContext";
import { Link } from "react-router-dom";
import IncomingCallContext from "../Context/IncomingCallContext";
import UserContext from "../Context/UserContext";

const DEFAULT_AVATAR = "https://cdn.onlinewebfonts.com/svg/img_329115.png";

const MessagePanel = ({ receiver, userId, username, avatar }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;

  // Context hooks
  const { data: user } = useContext(UserContext);
  const { removeMsgPanel } = useContext(MsgListContext);
  const isLoadingContext = useContext(LoadingContext);
  const { setCallingPopup } = useContext(IncomingCallContext);

  // API hooks
  const { data, isSuccess, isLoading, isError } = useGetMessagesQuery({
    receiver,
    sender: userId,
  });
  const [sendMessage] = useSendMessageMutation();
  const [updateMsgStatus] = useUpdateMsgStatusMutation();

  // State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const panelRef = useRef(null);

  // Loading state
  useEffect(() => {
    isLoadingContext.isLoading = isLoading;
  }, [isLoading, isLoadingContext]);

  // Mark last message as read on click
  const handlePanelClick = () => {
    if (messages.length > 0) {
      updateMsgStatus({
        senderId: receiver,
        messageId: messages[messages.length - 1].id,
      });
    }
  };

  // Pusher listener
  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_CLUSTER,
      encrypted: true,
      channelAuthorization: {
        endpoint: `${backEndURL}/api/pusher/auth`,
        headers: {
          authorization: `Bearer ${localStorage.getItem("login_token")}`,
        },
      },
    });

    const roomname = [userId, receiver].sort().join("");
    const channel = pusher.subscribe(`private-chat.${roomname}`);

    channel.bind("App\\Events\\MessageSent", (data) => {
      if (
        data.message.content === "Call invitation" &&
        data.message.receiver_id === userId
      ) {
        setCallingPopup({ status: "incoming-call", message: data });
      } else if (
        data.message.content === "Missed call" &&
        data.message.receiver_id === userId
      ) {
        setCallingPopup({ status: "missed-call", message: data });
      }
      setMessages((prev) => [
        ...prev,
        {
          id: data?.message?.id,
          type: data?.message?.type,
          senderName: data?.message?.sender_username,
          status: data?.message?.read,
          message: data?.message?.content,
          roomId: data?.message?.room_id,
          senderId: data?.message?.sender_id,
          timestamp: data?.message?.created_at,
        },
      ]);
    });

    channel.bind("App\\Events\\MessageStatusUpdated", (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data?.messageId ? { ...msg, status: 1 } : msg
        )
      );
    });

    return () => {
      pusher.unsubscribe(`private-chat.${roomname}`);
      pusher.disconnect();
    };
  }, [receiver, userId]);

  // Initial messages from API
  useEffect(() => {
    if (isSuccess) {
      setMessages(data.messages || []);
    }
  }, [data?.messages, isSuccess]);

  // Auto scroll to bottom
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage({
        receiver,
        sender: userId,
        content: newMessage,
        type: "text",
      });
      setNewMessage("");
    }
  };

  // Remove panel
  const removePanel = () => removeMsgPanel({ userId: receiver });

  // Open video call
  const openVideoCallWindow = () => {
    const roomID = encodeURIComponent(
      Math.floor(Math.random() * 10000).toString()
    );
    const url = `${
      import.meta.env.VITE_APP_URL
    }/test.html?roomID=${roomID}&userID=${user.user.id}&username=${
      user.user.username
    }`;
    window.open(url, "_blank");

    sendMessage({
      receiver,
      sender: userId,
      content: "Call invitation",
      type: "call-invitation",
      roomID,
      userName: username,
    });

    const callTimeout = setTimeout(() => {
      sendMessage({
        receiver,
        sender: userId,
        content: "Missed call",
        type: "missed-call",
      });
    }, 60000);

    window.addEventListener(
      "message",
      (event) => {
        if (event.data === "callEnded") {
          clearTimeout(callTimeout);
          sendMessage({
            receiver,
            sender: userId,
            content: "Call ended",
            type: "call-ended",
          });
        }
      },
      false
    );
  };

  // Render messages cleanly
  const renderMessages = useMemo(() => {
    if (messages.length > 0) {
      return messages.map((message, index) => (
        <div
          key={message.id + "_" + index}
          className="w-full break-words p-3 rounded-lg mb-2 shadow-sm bg-base-200"
        >
          <ChattingContentPanel message={message} avatar={avatar} />
        </div>
      ));
    }
    if (isError) {
      return (
        <p className="flex items-center justify-center font-medium text-lg text-red-600">
          {userId
            ? "Error occurred, check your internet connection"
            : "Log in to start a conversation"}
        </p>
      );
    }
    return null;
  }, [messages, isError, userId, avatar]);

  return (
    <div className="flex flex-col h-96 max-w-[300px] bg-base-100 shadow-md rounded">
      {/* Header */}
      <div className="p-2 border-b flex justify-between items-center bg-warning rounded-t-lg">
        <div className="flex items-center">
          <img
            src={avatar ? `${backEndURL}${avatar}` : DEFAULT_AVATAR}
            alt={`${username}'s Avatar`}
            className="w-8 h-8 rounded-full"
          />
          <Link to={`/get-user/${receiver}`}>
            <h1 className="font-semibold ml-2 hover:underline text-black">
              {username}
            </h1>
          </Link>
        </div>
        <div className="flex">
          <button className="btn-circle btn-sm" onClick={openVideoCallWindow}>
            <BsFillTelephoneFill />
          </button>
          <button className="btn-circle btn-sm">
            <FaWindowMinimize />
          </button>
          <button className="btn-circle btn-sm" onClick={removePanel}>
            <AiFillCloseCircle />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={panelRef}
        onClick={handlePanelClick}
        className="flex-grow overflow-y-auto overflow-x-hidden p-1 bg-base-200"
      >
        <p className="flex justify-center text-sm text-gray-500 my-2">
          {username}
        </p>
        <div className="flex flex-col gap-2">{renderMessages}</div>
      </div>

      {/* Input */}
      <div className="border-t p-3 bg-base-100">
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="input-sm input-bordered w-full"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your message..."
          />
          <button className="btn-sm btn-accent text-xl" type="submit">
            <PiPaperPlaneRightFill />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagePanel;
