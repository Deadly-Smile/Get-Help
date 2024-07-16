/* eslint-disable react/prop-types */
import moment from "moment";
import { useContext } from "react";
import UserContext from "../Context/UserContext";

const ChattingContentPanel = ({ message, avatar }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const { data } = useContext(UserContext);
  let status;
  if (message.type === "received") {
    if (message.status) {
      status = "Seen";
    } else {
      status = "Received";
    }
  } else {
    if (message.status) {
      status = "Seen";
    } else {
      status = "Sent";
    }
  }

  let renderMessage = null;

  if (message.type === "text" || message.type === "received") {
    renderMessage = (
      <div
        className={`flex ${
          message.senderName === data?.user?.username
            ? "flex-row-reverse "
            : " "
        }`}
      >
        <div className="chat-image avatar flex-col-reverse">
          <div className="w-8 rounded-full mx-1">
            <img
              src={
                avatar
                  ? `${backEndURL}${avatar}`
                  : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
              }
            />
          </div>
        </div>
        <div
          className={`chat-bubble ${
            message.senderName === data?.user?.username
              ? "chat-bubble-info"
              : "chat-bubble-warning"
          }`}
        >
          {message.message}
        </div>
      </div>
    );
  } else if (message.message === "Call invitation") {
    renderMessage = (
      <div className="flex items-center">
        <p className="chat-bubble chat-bubble-warning">
          {message.senderName} is inviting you to a call.
        </p>
      </div>
    );
  } else if (message.message === "Call accepted") {
    renderMessage = (
      <div className="flex items-center">
        <p className="chat-bubble chat-bubble-info">
          Call accepted. Room ID: {message.roomID}
        </p>
      </div>
    );
  } else if (message.message === "Call declined") {
    renderMessage = (
      <div className="flex items-center">
        <p className="chat-bubble chat-bubble-info">Call ended.</p>
      </div>
    );
  } else {
    renderMessage = (
      <div
        className={`chat-bubble ${
          message.senderName === data?.user?.username
            ? "chat-bubble-info"
            : "chat-bubble-warning"
        }`}
      >
        <p>{message.message}</p>
      </div>
    );
  }

  return (
    <div className="">
      <div
        className={`flex ${
          message.senderName === data?.user?.username
            ? "justify-end "
            : "justify-start "
        }`}
        title={moment(message?.timestamp).fromNow()}
      >
        {renderMessage}
      </div>
      <div
        className={`flex ${
          message.senderName === data?.user?.username
            ? "justify-end "
            : "justify-start "
        }`}
      >
        <p className="text-xs text-gray-500">{status}</p>
      </div>
    </div>
  );
};

export default ChattingContentPanel;
