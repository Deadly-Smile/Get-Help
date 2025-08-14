import { useContext } from "react";
import MsgListContext from "../Context/MsgListContext";
import UserContext from "../Context/UserContext";
import MessagePanel from "./MessagePanel";

const MessagePanelList = () => {
  const { data } = useContext(UserContext);
  const { msgList } = useContext(MsgListContext);
  console.log(msgList);
  let renderList = null;
  renderList = msgList.map((msg, index) => {
    return (
      <MessagePanel
        key={index}
        receiver={msg.id}
        userId={data?.user?.id}
        username={msg.username}
        avatar={msg.avatar}
      />
    );
  });
  return <div className="flex justify-end">{renderList}</div>;
};

export default MessagePanelList;
