/* eslint-disable react/prop-types */
import moment from "moment";
import { useContext } from "react";
import UserContext from "../Context/UserContext";

const ChattingContentPanel = ({ message, avatar }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const { data: userData } = useContext(UserContext);

  const isOwnMessage = message.senderName === userData?.user?.username;

  // Determine status text
  const status =
    message.status && message.type !== "received"
      ? "Seen"
      : message.type === "received"
      ? message.status
        ? "Seen"
        : "Received"
      : "Sent";

  // Bubble color
  const bubbleColor = isOwnMessage ? "bg-blue-200" : "bg-yellow-200";
  const bubbleAlign = isOwnMessage ? "justify-end" : "justify-start";
  const textAlign = isOwnMessage ? "text-right" : "text-left";

  // Render content based on message type
  let content = null;

  if (message.type === "text" || message.type === "received") {
    content = (
      <div className="flex items-end gap-2">
        {!isOwnMessage && (
          <img
            src={
              avatar
                ? `${backEndURL}${avatar}`
                : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
            }
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
        )}
        <div
          className={`max-w-[70%] break-words px-3 py-2 rounded-lg ${bubbleColor}`}
        >
          {message.message}
        </div>
        {isOwnMessage && (
          <img
            src={
              avatar
                ? `${backEndURL}${avatar}`
                : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
            }
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
        )}
      </div>
    );
  } else if (message.message === "Call invitation") {
    content = (
      <p className="max-w-[70%] break-words px-3 py-2 rounded-lg bg-yellow-200 text-sm">
        {message.senderName} is inviting you to a call.
      </p>
    );
  } else if (message.message === "Call accepted") {
    content = (
      <p className="max-w-[70%] break-words px-3 py-2 rounded-lg bg-blue-200 text-sm">
        Call accepted. Room ID: {message.roomID}
      </p>
    );
  } else if (message.message === "Call declined") {
    content = (
      <p className="max-w-[70%] break-words px-3 py-2 rounded-lg bg-blue-200 text-sm">
        Call ended.
      </p>
    );
  } else {
    content = (
      <div
        className={`max-w-[70%] break-words px-3 py-2 rounded-lg ${bubbleColor}`}
      >
        {message.message}
      </div>
    );
  }

  return (
    <div className="text-black">
      <div
        className={`flex ${bubbleAlign}`}
        title={moment(message?.timestamp).fromNow()}
      >
        {content}
      </div>
      <div className={`flex ${bubbleAlign}`}>
        <p className={`text-xs ${textAlign}`}>{status}</p>
      </div>
    </div>
  );
};

export default ChattingContentPanel;
