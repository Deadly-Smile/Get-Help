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
        <img
          src={
            avatar
              ? `${backEndURL}${avatar}`
              : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
          }
          className="max-w-[24px] max-h-6 rounded-full mr-1 mt-3"
        />
        <div
          className={`p-2 my-1 text-white w-fit rounded-lg ${
            message.type === "sent" ? "bg-[#3B82F6]" : "bg-[#6B7280]"
          }`}
        >
          <p>{message.message}</p>
        </div>
      </div>
    );
  } else {
    renderMessage = (
      <div
        className={`p-2 ml-1 text-white w-fit rounded-lg ${
          message.type === "sent" ? "bg-[#3B82F6]" : "bg-[#6B7280]"
        }`}
      >
        <p>{message.message}</p>
      </div>
    );
  }
  return (
    <div className="mx-4">
      <div
        className={`flex ${
          message.type === "sent"
            ? "justify-end -mr-2 ml-2"
            : "justify-start -ml-2 mr-2"
        }`}
        title={moment(message?.timestamp).fromNow()}
      >
        {renderMessage}
      </div>
      <div
        className={`flex ${
          message.type === "sent"
            ? "justify-end -mr-2 ml-2"
            : "justify-start -ml-2 mr-2"
        }`}
      >
        <p className="text-xs text-gray-500">{status}</p>
      </div>
    </div>
  );
};

export default ChattingContentPanel;
