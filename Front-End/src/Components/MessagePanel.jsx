// src/Components/MessagePanel.jsx
import { useContext, useEffect, useState, useRef } from "react";
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

// eslint-disable-next-line react/prop-types
const MessagePanel = ({ receiver, userId, username, avatar }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const [messages, setMessages] = useState([]);
  const panelRef = useRef(null);
  const { data, isSuccess, isLoading, isError } = useGetMessagesQuery({
    receiver: receiver,
    sender: userId,
  });
  const [sendMessage] = useSendMessageMutation();
  const { removeMsgPanel } = useContext(MsgListContext);
  const [updateMsgStatus] = useUpdateMsgStatusMutation();
  const isLoadingContext = useContext(LoadingContext);
  const { setCallingPopup } = useContext(IncomingCallContext);

  useEffect(() => {
    isLoadingContext.isLoading = isLoading;
  }, [isLoading, isLoadingContext]);

  const handlePanelClick = () => {
    if (messages.length > 0) {
      updateMsgStatus({
        senderId: receiver,
        messageId: messages[messages.length - 1].id,
      });
    }
  };

  useEffect(() => {
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

    const roomname = [userId, receiver];
    roomname.sort();
    const channel = usePusher.subscribe(
      `private-chat.${roomname[0]}${roomname[1]}`
    );

    channel.bind("App\\Events\\MessageSent", (data) => {
      console.log(data);
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
      setMessages((prevMessages) => [
        ...prevMessages,
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
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === data?.messageId ? { ...message, status: 1 } : message
        )
      );
    });

    return () => {
      usePusher.unsubscribe(`private-chat.${receiver}`);
      usePusher.disconnect();
    };
  }, [receiver, userId]);

  useEffect(() => {
    if (isSuccess) {
      setMessages(data.messages);
    }
  }, [data?.messages, isSuccess]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      sendMessage({
        receiver: receiver,
        sender: userId,
        content: newMessage,
        type: "text",
      });
      setNewMessage("");
    }
  };

  const removePanel = () => {
    removeMsgPanel({ userId: receiver });
  };

  useEffect(() => {
    // Scroll to the bottom of the panel on initial load
    panelRef.current.scrollTop = panelRef.current.scrollHeight;
  }, [messages]);

  let renderMessages = null;

  if (messages.length > 0) {
    renderMessages = messages.map((message, index) => (
      <ChattingContentPanel
        message={message}
        key={message.id + "__" + index + "__" + message.updated_at}
        avatar={avatar}
      />
    ));
  } else if (isError) {
    if (userId) {
      renderMessages = (
        <p className="flex items-center justify-center font-medium text-lg text-red-600">
          Error occured, check your internet connention
        </p>
      );
    } else {
      renderMessages = (
        <p className="flex items-center justify-center font-medium text-lg text-red-600">
          Log in to start a conversation
        </p>
      );
    }
  }

  const openVideoCallWindow = () => {
    const roomID = encodeURIComponent(
      Math.floor(Math.random() * 10000).toString()
    );
    const url = `${
      import.meta.env.VITE_APP_URL
    }/test.html?roomID=${roomID}&userID=${userId}&username=${username}`;
    window.open(url, "_blank");
    sendMessage({
      receiver: receiver,
      sender: userId,
      content: "Call invitation",
      type: "call-invitation",
      roomID: roomID,
      userName: username,
    });

    const callTimeout = setTimeout(() => {
      sendMessage({
        receiver: receiver,
        sender: userId,
        content: "Missed call",
        type: "missed-call",
      });
    }, 60000);

    window.addEventListener(
      "message",
      (event) => {
        if (event.data === "callEnded") {
          console.log("Video call ended");
          clearTimeout(callTimeout);
          sendMessage({
            receiver: receiver,
            sender: userId,
            content: "Call ended",
            type: "call-ended",
          });
        }
      },
      false
    );
  };

  return (
    <div className="flex flex-col h-96 max-w-[300px] bg-base-100">
      <div className="p-4 border-b flex justify-between bg-warning rounded-md rounded-e-none">
        <div className="flex">
          <img
            src={
              avatar
                ? `${backEndURL}${avatar}`
                : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
            }
            alt={`${username}'s Avatar`}
            className="max-w-[24px] max-h-6 rounded-full"
          />
          <Link to={`/get-user/${receiver}`}>
            <h1 className="font-semibold ml-2 hover:underline text-black">
              {username}
            </h1>
          </Link>
        </div>
        <div className="flex">
          <button
            className="btn bg-transparent border-0 text-2xl btn-active -mr-2 btn-sm"
            onClick={openVideoCallWindow}
          >
            <BsFillTelephoneFill />
          </button>
          <button className="btn bg-transparent border-0 text-2xl btn-active -mr-2 btn-sm">
            <FaWindowMinimize />
          </button>
          <button
            className="btn bg-transparent border-0 text-2xl btn-active -mr-2 btn-sm"
            onClick={removePanel}
          >
            <AiFillCloseCircle />
          </button>
        </div>
      </div>
      <div
        className="flex-grow overflow-y-scroll p-3"
        style={{ maxHeight: "100%", overflowY: "scroll" }}
        ref={panelRef}
        onClick={handlePanelClick}
      >
        <p className="flex justify-center text-xl font-semibold">{username}</p>
        {renderMessages}
      </div>
      <div className="divider m-0" />
      <form className="join p-3" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="input input-bordered w-full join-item"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write your message"
          required
        />
        <button className="btn btn-accent join-item text-2xl" type="submit">
          <PiPaperPlaneRightFill />
        </button>
      </form>
    </div>
  );
};

export default MessagePanel;
