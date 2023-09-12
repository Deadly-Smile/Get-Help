import { useState } from "react";

const MessagePanel = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello", sender: "user", status: "sent" },
    { id: 2, text: "Hi there!", sender: "other", status: "read" },
    // Add more messages here
  ]);

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

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-200 p-4 border-b border-gray-300">
        <h1 className="text-lg font-semibold">Messenger</h1>
      </div>
      <div className="flex-grow overflow-y-scroll p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.sender === "user" ? "self-end" : "self-start"
            } p-2 my-1 mx-4 rounded-lg bg-blue-500 text-white max-w-2/3`}
          >
            {message.text}
            <div className="text-xs mt-1">
              {message.status === "sent" && "Sent"}
              {message.status === "read" && "Read"}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-200 p-4 border-t border-gray-300">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow rounded-full p-2 bg-gray-300 focus:outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePanel;
