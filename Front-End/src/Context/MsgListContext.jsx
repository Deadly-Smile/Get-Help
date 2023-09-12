import { createContext, useState } from "react";

const MsgListContext = createContext();
// eslint-disable-next-line react/prop-types
function Provider({ children }) {
  const [msgList, setMsgList] = useState([]);

  const addMsgPanel = ({ userId }) => {
    let list = msgList;
    if (msgList.length > 2) {
      list = msgList.slice(1, msgList.length);
    }
    list = list.filter((id) => id !== userId);
    list.push(userId);
    setMsgList(list);
    console.log(msgList);
  };

  const removeMsgPanel = ({ userId }) => {
    const index = msgList.indexOf(userId);
    let list = msgList;
    if (index > -1) {
      list = msgList.splice(index, 1);
    }
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
