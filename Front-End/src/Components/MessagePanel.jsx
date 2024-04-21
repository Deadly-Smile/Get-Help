import { useContext, useEffect, useState, useRef } from "react";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateMsgStatusMutation,
} from "../Store";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaWindowMinimize } from "react-icons/fa";
import Button from "./Button";
import MsgListContext from "../Context/MsgListContext";
import ChattingContentPanel from "./ChattingContentPanel";
import Pusher from "pusher-js";
import LoadingContext from "../Context/LoadingContext";
import { Link } from "react-router-dom";

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
  // Pusher.logToConsole = true;
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
      // console.log(data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: data?.message?.id,
          type: "received",
          senderName: data?.message?.sender_username,
          status: data?.message?.read,
          message: data?.message?.content,
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

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage({ receiver: receiver, sender: userId, content: newMessage });
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
      <ChattingContentPanel message={message} key={index} avatar={avatar} />
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
          <Button className="text-base-200 border-collapse border-0 text-2xl hover:text-blue-700 -mr-2">
            <BsFillTelephoneFill />
          </Button>
          <Button className="text-base-200 border-collapse border-0 text-2xl hover:text-base-500 -mr-2">
            <FaWindowMinimize />
          </Button>
          <Button
            className="text-base-200 border-collapse border-0 text-2xl hover:text-red-700 -mr-2"
            rounded
            onClick={removePanel}
          >
            <AiFillCloseCircle />
          </Button>
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
      <div className="join p-3">
        <input
          type="text"
          className="input input-bordered join-item max-w-[220px]"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="btn join-item rounded-r-full"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      {/* <div className="bg-base-200 p-3 border-t border-base-300">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow rounded p-2 bg-base-300 focus:outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            className="text-blue-800 text-2xl hover:bg-blue-300"
            onClick={handleSendMessage}
          >
            <BiSolidSend />
          </Button>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default MessagePanel;
