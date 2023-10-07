import { useGetContactsQuery } from "../Store";
import ToastMessage from "../Components/ToastMessage";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import MsgListContext from "../Context/MsgListContext";

const ContactPanel = () => {
  const [showToast, setShowToast] = useState(false);
  const { data, isError } = useGetContactsQuery();
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const { addMsgPanel } = useContext(MsgListContext);
  const [groupedContacts, setGroupedContacts] = useState({});

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (data) {
      const grouped = {};
      data.contacts.forEach((contact) => {
        const { category } = contact;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(contact);
      });
      setGroupedContacts(grouped);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      handleShowToast();
    }
  }, [isError]);
  let renderMsg = null;
  if (isError) {
    renderMsg = (
      <ToastMessage type={"error"} message={"An unexpected error occured"} />
    );
  }
  return (
    <div className="pl-4 pr-2 overflow-y-auto min-h-[100px]">
      <h2 className="text-xl font-bold mb-4">Contacts</h2>
      {Object.keys(groupedContacts).map((category) => (
        <div key={category} className="mb-4">
          <h3 className="mb-2 text-gray-600 text-center text-sm ml-2">
            {category}
          </h3>
          <ul>
            {groupedContacts[category].map((contact) => (
              <li
                onClick={() => {
                  addMsgPanel({
                    userId: contact.userID,
                    username: contact.name,
                    avater: contact?.avatar,
                  });
                }}
                key={contact.userID}
                className="flex justify-between items-center p-2 rounded hover:bg-blue-100"
              >
                <div className="flex">
                  <img
                    src={
                      contact?.avatar
                        ? `${backEndURL}${contact?.avatar}`
                        : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
                    }
                    alt={`${contact.name}'s Avatar`}
                    className="w-6 h-6 rounded-full flex-none"
                  />
                  <div>
                    <Link to={`/home/get-user/${contact.userID}`}>
                      <h1 className="grow font-semibold ml-2 text-blue-600 hover:text-green-800 hover:underline">
                        {contact.name}
                      </h1>
                    </Link>
                  </div>
                </div>

                <div
                  className={`flex-none w-2 h-2 rounded-full ${
                    contact.status === "Online"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
      {showToast && renderMsg}
    </div>
  );
};

export default ContactPanel;
