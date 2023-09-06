// eslint-disable-next-line react/prop-types
const Contact = ({ name, profilePic, status }) => {
  return (
    <div className="flex items-center p-4 space-x-4 border-b border-gray-300">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={profilePic}
        alt={name}
      />
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-500">{status}</p>
      </div>
    </div>
  );
};

export default Contact;
