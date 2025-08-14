import { useGetContactsQuery } from "../Store";
import ToastMessage from "../Components/ToastMessage";
import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import MsgListContext from "../Context/MsgListContext";
import UserContext from "../Context/UserContext";

const DEFAULT_AVATAR = "https://cdn.onlinewebfonts.com/svg/img_329115.png";

const ContactPanel = () => {
  const { data: contacts, isError, isLoading } = useGetContactsQuery();
  const { addMsgPanel } = useContext(MsgListContext);
  const userData = useContext(UserContext);
  const backEndURL = import.meta.env.VITE_BACKEND_URL;

  const [showToast, setShowToast] = useState(false);

  // Group contacts by category only when we have a valid array
  const groupedContacts = useMemo(() => {
    if (!Array.isArray(contacts)) return {};
    return contacts.reduce((groups, contact) => {
      const category = contact.category || "Uncategorized";
      if (!groups[category]) groups[category] = [];
      groups[category].push(contact);
      return groups;
    }, {});
  }, [contacts]);

  useEffect(() => {
    if (isError) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const handleContactClick = (contact) => {
    addMsgPanel({
      userId: contact.userID,
      username: contact.name,
      avatar: contact.avatar,
    });
  };

  const renderContactItem = (contact) => {
    if (contact.userID === userData?.data?.user?.id) return null;
    return (
      <li
        key={contact.userID}
        onClick={() => handleContactClick(contact)}
        className="flex justify-between items-center p-2 rounded hover:bg-blue-100 cursor-pointer"
      >
        <div className="flex">
          <img
            src={
              contact.avatar ? `${backEndURL}${contact.avatar}` : DEFAULT_AVATAR
            }
            alt={`${contact.name}'s Avatar`}
            className="w-6 h-6 rounded-full flex-none"
          />
          <Link to={`/home/get-user/${contact.userID}`} className="ml-2">
            <h1 className="grow font-semibold text-blue-600 hover:text-green-800 hover:underline">
              {contact.name}
            </h1>
          </Link>
        </div>
        <div
          className={`flex-none w-2 h-2 rounded-full ${
            contact.status === "Online" ? "bg-green-500" : "bg-yellow-500"
          }`}
        />
      </li>
    );
  };

  return (
    <div className="pl-4 pr-2 overflow-y-auto min-h-[100px]">
      <h2 className="mb-4 text-center">Contacts</h2>

      {isLoading && (
        <p className="text-gray-500 text-center">Loading contacts...</p>
      )}

      {!isLoading && Object.keys(groupedContacts).length === 0 && (
        <p className="text-gray-500 text-center">No contacts found</p>
      )}

      {Object.entries(groupedContacts).map(([category, contactList]) => (
        <div key={category} className="mb-4">
          <h3 className="mb-2 text-gray-600 text-sm ml-2">{category}</h3>
          <ul>{contactList.map(renderContactItem)}</ul>
        </div>
      ))}

      {showToast && (
        <ToastMessage type="error" message="An unexpected error occurred" />
      )}
    </div>
  );
};

export default ContactPanel;
