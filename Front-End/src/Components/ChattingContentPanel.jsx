/* eslint-disable react/prop-types */

const ChattingContentPanel = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.type === "sent" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`p-2 my-1 mx-4 text-white w-fit rounded ${
          message.type === "sent" ? "bg-blue-500" : "bg-gray-500"
        }`}
      >
        <p>{message.message}</p>

        <div className="text-xs mt-1">
          {message.status === "sent" && "Sent"}
          {message.status === "read" && "Read"}
        </div>
      </div>
    </div>
  );
};

export default ChattingContentPanel;
