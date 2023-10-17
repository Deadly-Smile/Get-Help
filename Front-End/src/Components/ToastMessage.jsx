// eslint-disable-next-line react/prop-types
const ToastMessage = ({ message, type }) => {
  const toastClasses = {
    success: "bg-green-700 text-white",
    error: "bg-red-700 text-white",
    info: "bg-blue-700 text-white",
  };

  // type prop (success, error, or info) using Tailwind CSS utility classes.
  return (
    <div
      className={`fixed opacity-90 font-semibold bottom-5 right-5 p-4 rounded ${toastClasses[type]}`}
    >
      {message}
    </div>
  );
};

export default ToastMessage;
