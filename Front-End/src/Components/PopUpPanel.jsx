import { useRef, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const PopUpPanel = ({ isOpen, onClose, children }) => {
  const panelRef = useRef(null);

  const handleClickOutside = (event) => {
    if (panelRef.current && !panelRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
        isOpen ? "visible" : "hidden"
      }`}
    >
      <div
        ref={panelRef}
        className="bg-white p-6 rounded shadow-md max-h-[80vh] overflow-auto w-4/5"
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  );
};

export default PopUpPanel;
