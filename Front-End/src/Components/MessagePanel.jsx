import { useEffect, useState } from "react";
import { useGetMessagesQuery } from "../Store";
import { BiSolidSend } from "react-icons/bi";
import Button from "./Button";

// eslint-disable-next-line react/prop-types
const MessagePanel = ({ receiver, userId, username }) => {
  const { data, isSuccess, isLoading, isError } = useGetMessagesQuery({
    receiver: receiver,
    sender: userId,
  });
  const [messages, setMessages] = useState([
    // { id: 1, text: "Hello", sender: "user", status: "sent" },
    // { id: 2, text: "Hi there!", sender: "other", status: "read" },
    // // Add more messages here
  ]);

  useEffect(() => {
    if (isSuccess) {
      setMessages(data.messages);
    }
  }, [data?.messages, isSuccess]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMessageObj = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        status: "sent", // Initially set as sent
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage("");
    }
  };

  let renderMessages = null;

  if (messages.length > 0) {
    renderMessages = messages.map((message) => (
      <div
        key={message.id}
        className={`${
          message.sender_username !== username ? "self-end" : "self-start"
        } p-2 my-1 mx-4 rounded-lg bg-blue-500 text-white max-w-2/3`}
      >
        {message.message}
        <div className="text-xs mt-1">
          {message.status === "sent" && "Sent"}
          {message.status === "read" && "Read"}
        </div>
      </div>
    ));
  } else if (isSuccess) {
    renderMessages = (
      <p className="flex justify-center font-medium text-lg">{username}</p>
    );
  } else if (isLoading) {
    renderMessages = (
      <p className="flex justify-center font-medium text-lg">Loading...</p>
    );
  } else if (isError) {
    renderMessages = (
      <p className="flex justify-center font-medium text-lg">
        Error occured, check your internet connention
      </p>
    );
  }

  return (
    <div className="flex flex-col h-96 max-w-[300px] bg-gray-200 mx-2">
      <div className="bg-gray-900 p-4 border-b border-gray-900">
        <h1 className="text-lg font-semibold text-gray-100">{username}</h1>
      </div>
      <div className="flex-grow overflow-y-scroll p-3">{renderMessages}</div>
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
