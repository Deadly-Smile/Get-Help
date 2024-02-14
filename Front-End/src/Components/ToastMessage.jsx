// eslint-disable-next-line react/prop-types
const ToastMessage = ({ message, type }) => {
  // type prop (success, error, or info) using Tailwind CSS utility classes.
  return (
    <div className="toast toast-end">
      <div className={`alert alert-${type}`}>
        <span>{message}</span>
      </div>
    </div>
    // <div
    //   className={`fixed opacity-90 font-semibold bottom-5 right-5 p-4 rounded ${toastClasses[type]}`}
    // >
    //   {message}
    // </div>
  );
};

export default ToastMessage;
