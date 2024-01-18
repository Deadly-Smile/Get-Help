import { useState } from "react";
import { GoChevronLeft, GoChevronDown } from "react-icons/go";

// eslint-disable-next-line react/prop-types
const ExpandablePanel = ({ header, children }) => {
  const [isExpended, setIsExpended] = useState(false);
  const handleExpendIconClick = () => {
    setIsExpended(!isExpended);
  };
  return (
    <div className="md-2 border rounded bg-slate-50">
      <div className="flex justify-between  p-2 items-center">
        <div className="flex flex-row items-center justify-between">
          {header}
        </div>
        <div onClick={handleExpendIconClick} className="cursor-pointer">
          {isExpended ? <GoChevronDown /> : <GoChevronLeft />}
        </div>
      </div>
      {isExpended && <div className="p-2 border-2">{children}</div>}
    </div>
  );
};

export default ExpandablePanel;
