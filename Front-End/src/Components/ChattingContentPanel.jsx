/* eslint-disable react/prop-types */
import moment from "moment";

const ChattingContentPanel = ({ message, avatar }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  let status;

  if (message.type === "received") {
    if (message.status) {
      status = "Seen";
    } else {
      status = "Recieved";
    }
  } else {
    if (message.status) {
      status = "Seen";
    } else {
      status = "Sent";
    }
  }
  // console.log(avatar);
  let renderMessage = null;
  if (message.type !== "sent") {
    renderMessage = (
      <div className="flex">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              src={
                avatar
                  ? `${backEndURL}${avatar}`
                  : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
              }
              // className="max-w-[24px] max-h-6 rounded-full mr-1 mt-3"
            />{" "}
          </div>
        </div>

        <div
          className={`chat-bubble ${
            message.type === "sent" ? "chat-bubble-info" : "chat-bubble-warning"
          }`}
        >
          {message.message}
        </div>
      </div>
    );
  } else {
    renderMessage = (
      <div
        className={`chat-bubble ${
          message.type === "sent" ? "chat-bubble-info" : "chat-bubble-warning"
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
          message.type === "sent" ? "justify-end " : "justify-start "
        }`}
        title={moment(message?.timestamp).fromNow()}
      >
        {renderMessage}
      </div>
      <div
        className={`flex ${
          message.type === "sent" ? "justify-end " : "justify-start "
        }`}
      >
        <p className="text-xs text-gray-500">{status}</p>
      </div>
    </div>
  );
};

export default ChattingContentPanel;
