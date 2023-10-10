import { createContext, useState } from "react";

const MsgListContext = createContext();
// eslint-disable-next-line react/prop-types
function Provider({ children }) {
  const [msgList, setMsgList] = useState([]);

  const addMsgPanel = ({ userId, username, avatar }) => {
    let list = msgList;
    if (msgList.length > 2) {
      list = msgList.slice(1, msgList.length);
    }
    list = list.filter((msg) => msg.id !== userId);
    list.push({ id: userId, username, avatar });
    setMsgList(list);
  };

  const removeMsgPanel = ({ userId }) => {
    let list = msgList.filter((msg) => msg.id !== userId);
    setMsgList([...list]);
  };

  const valToShare = {
    msgList,
    addMsgPanel,
    removeMsgPanel,
  };

  return (
    <MsgListContext.Provider value={valToShare}>
      {children}
    </MsgListContext.Provider>
  );
}

export { Provider };
export default MsgListContext;
