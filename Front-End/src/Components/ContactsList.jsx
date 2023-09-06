import Contact from "./Contact";
// eslint-disable-next-line react/prop-types
const ContactsList = ({ contacts }) => {
  return (
    <div className="space-y-2">
      {contacts.map((contact, index) => (
        <Contact
          key={index}
          name={contact.name}
          profilePic={contact.profilePic}
          status={contact.status}
        />
      ))}
    </div>
  );
};

export default ContactsList;
