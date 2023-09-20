/* eslint-disable react/prop-types */
import moment from "moment";

const ChattingContentPanel = ({ message }) => {
  // console.log(message);
  // console.log(message.id, lastSeenMsg);
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
        <div
          className={`p-2 my-1 text-white w-fit rounded-lg ${
            message.type === "sent" ? "bg-[#3B82F6]" : "bg-[#6B7280]"
          }`}
        >
          <p>{message.message}</p>
        </div>
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
