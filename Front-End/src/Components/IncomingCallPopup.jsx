import { useContext, useEffect, useRef, useState } from "react";
import IncomingCallContext from "../Context/IncomingCallContext";
import UserContext from "../Context/UserContext";

const IncomingCallPopup = () => {
  const { callingPopup, setCallingPopup } = useContext(IncomingCallContext);
  const { data } = useContext(UserContext);
  const [isIncoming, setIsIncoming] = useState(false);
  const [isMissed, setIsMissed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const dialogRef = useRef(null); // Reference to the dialog element

  const handleAcceptCall = () => {
    const { message } = callingPopup;
    const url = `${import.meta.env.VITE_APP_URL}/test.html?roomID=${
      message.message.room_id
    }&userID=${data.user.id}&username=${data.user.username}`;
    window.open(url, "_blank");
    setIsDisabled(true);
  };

  const handleDeclineCall = () => {
    setCallingPopup({ status: "no-call", message: null });
  };

  useEffect(() => {
    if (callingPopup.status == "incoming-call") {
      setIsIncoming(true);
      setIsMissed(false);
      setIsDisabled(false);
    } else if (callingPopup.status == "missed-call") {
      setIsMissed(true);
      setIsIncoming(false);
      setIsDisabled(false);
    } else {
      setIsMissed(false);
      setIsIncoming(false);
      setIsDisabled(true);
    }
  }, [callingPopup]);

  // Show the dialog when isIncoming or isMissed changes
  useEffect(() => {
    if ((isIncoming || isMissed) && dialogRef.current) {
      dialogRef.current.showModal();
      const timer = setTimeout(() => {
        dialogRef.current.close();
      }, 60000); // Automatically close after 1 minute (60000 ms)
      return () => clearTimeout(timer);
    }
  }, [isIncoming, isMissed]);

  let render = null;
  if (callingPopup.status == "incoming-call") {
    render = (
      <dialog id="my_modal_2" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleDeclineCall}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            Incoming call from {callingPopup.message.message.sender_username}
          </h3>
          <div className="flex">
            <button className="btn btn-success mr-2" onClick={handleAcceptCall}>
              Accept
            </button>
            <button className="btn btn-error" onClick={handleDeclineCall}>
              Decline
            </button>
          </div>
        </div>
      </dialog>
    );
  } else if (callingPopup.status == "missed-call") {
    render = (
      <dialog id="my_modal_2" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            Missed a call from {callingPopup.message.message.sender_username}
          </h3>
        </div>
      </dialog>
    );
  } else if (isDisabled) {
    render = null;
  }
  return <div>{render}</div>;
};

export default IncomingCallPopup;
