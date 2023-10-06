// eslint-disable-next-line react/prop-types
const ToastMessage = ({ message, type }) => {
  const toastClasses = {
    success: "bg-green-500 text-black",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-black",
  };

  // type prop (success, error, or info) using Tailwind CSS utility classes.
  return (
    <div
      className={`fixed opacity-90 bottom-5 right-5 p-4 rounded ${toastClasses[type]}`}
    >
      {message}
    </div>
  );
};

export default ToastMessage;
