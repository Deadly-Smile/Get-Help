/* eslint-disable react/prop-types */
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhone,
} from "react-icons/fa";

export const RealTimeChatButtons = ({
  toggleCamera,
  toggleMute,
  endCall,
  isMuted,
  isCameraOff,
}) => {
  return (
    <div className="text-center bg-opacity-10 bg-black -mt-20 absolute w-full pb-1">
      <button onClick={toggleMute} className="meet-button">
        {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>
      <button onClick={toggleCamera} className="meet-button">
        {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
      </button>
      <button onClick={endCall} className="meet-button">
        <FaPhone />
      </button>
    </div>
  );
};
