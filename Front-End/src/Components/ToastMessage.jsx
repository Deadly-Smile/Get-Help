// eslint-disable-next-line react/prop-types
const ToastMessage = ({ message, type }) => {
  // type prop (success, error, or info) using Tailwind CSS utility classes.
  if (type === "success") {
    return (
      <div className="toast toast-end max-w-sm min-w-min">
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{message}</span>
        </div>
      </div>
    );
  } else if (type === "error") {
    return (
      <div className="toast toast-end max-w-sm">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{message}</span>
        </div>
      </div>
    );
  } else if (type === "info") {
    return (
      <div className="toast toast-end max-w-sm">
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{message}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="toast toast-end max-w-sm">
        <div className="alert">
          <span>{message}</span>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="toast toast-end">
  //     <div className={`alert alert-${type}`}>
  //       <span>{message}</span>
  //     </div>
  //   </div>
  //   // <div
  //   //   className={`fixed opacity-90 font-semibold bottom-5 right-5 p-4 rounded ${toastClasses[type]}`}
  //   // >
  //   //   {message}
  //   // </div>
  // );
};

export default ToastMessage;
