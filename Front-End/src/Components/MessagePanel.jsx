import { useContext, useEffect, useState, useRef } from "react";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateMsgStatusMutation,
} from "../Store";
import { BiSolidSend } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaWindowMinimize } from "react-icons/fa";
import Button from "./Button";
import MsgListContext from "../Context/MsgListContext";
import ChattingContentPanel from "./ChattingContentPanel";
import Pusher from "pusher-js";
// import { beamsClient } from "../Hooks/push-noti";

// eslint-disable-next-line react/prop-types
const MessagePanel = ({ receiver, userId, username }) => {
  const [messages, setMessages] = useState([]);
  const panelRef = useRef(null);
  const { data, isSuccess, isLoading, isError } = useGetMessagesQuery({
    receiver: receiver,
    sender: userId,
  });
  const [sendMessage] = useSendMessageMutation();
  const { removeMsgPanel } = useContext(MsgListContext);
  const [updateMsgStatus] = useUpdateMsgStatusMutation();

  //Tesing push-notification
  // useEffect(() => {
  //   beamsClient
  //     .start()
  //     .then((beamsClient) => beamsClient.getDeviceId())
  //     .then((deviceId) =>
  //       console.log("Successfully registered with Beams. Device ID:", deviceId)
  //     )
  //     .catch(console.error);
  // }, []);

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
      console.log(data);
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
      <ChattingContentPanel message={message} key={index} />
    ));
  } else if (isLoading) {
    renderMessages = (
      <p className="flex justify-center font-medium text-lg">Loading...</p>
    );
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
    <div className="flex flex-col rounded h-96 max-w-[300px] bg-gray-200 mx-2">
      <div className="bg-gray-900 p-4 border-b border-gray-900 flex justify-between">
        <h1 className="text-lg font-semibold text-gray-100">{username}</h1>
        <div className="flex">
          <Button className="text-gray-200 border-collapse border-0 text-2xl hover:text-blue-700 -mr-2">
            <BsFillTelephoneFill />
          </Button>
          <Button className="text-gray-200 border-collapse border-0 text-2xl hover:text-gray-500 -mr-2">
            <FaWindowMinimize />
          </Button>
          <Button
            className="text-gray-200 border-collapse border-0 text-2xl hover:text-red-700 -mr-2"
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
      <div className="bg-gray-200 p-3 border-t border-gray-300">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow rounded p-2 bg-gray-300 focus:outline-none"
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
        </div>
      </div>
    </div>
  );
};

export default MessagePanel;
