import { useContext } from "react";
import MsgListContext from "../Context/MsgListContext";

const MessagePanelList = () => {
  const { msgList } = useContext(MsgListContext);
  return <div>Message Panels</div>;
};

export default MessagePanelList;
