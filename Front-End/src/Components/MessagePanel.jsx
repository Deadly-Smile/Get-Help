import { useContext, useEffect, useState } from "react";
import { useGetMessagesQuery } from "../Store";
import { BiSolidSend } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaWindowMinimize } from "react-icons/fa";
import Button from "./Button";
import MsgListContext from "../Context/MsgListContext";
import ChattingContentPanel from "./ChattingContentPanel";

// eslint-disable-next-line react/prop-types
const MessagePanel = ({ receiver, userId, username }) => {
  const { data, isSuccess, isLoading, isError } = useGetMessagesQuery({
    receiver: receiver,
    sender: userId,
  });
  // const [sendMessage, result] = useSendMessageMutation();
  const { removeMsgPanel } = useContext(MsgListContext);
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
        status: "sending...", // Initially set as sent
      };
      // sendMessage({ receiver: receiver, sender: userId, content: newMessage });
      setMessages([...messages, newMessageObj]);
      setNewMessage("");
    }
  };

  const removePanel = () => {
    removeMsgPanel({ userId: receiver });
  };

  let renderMessages = null;

  if (messages.length > 0) {
    renderMessages = messages.map((message) => (
      <ChattingContentPanel message={message} key={message.id} />
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
      <div className="flex-grow overflow-y-scroll p-3">
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
