// eslint-disable-next-line react/prop-types
const ExpandablePanel = ({ header, children }) => {
  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="radio" name="my-accordion-2" defaultChecked />
      <div className="collapse-title text-xl font-medium">{header}</div>
      <div className="collapse-content">
        <p>{children}</p>
      </div>
    </div>
  );
};

export default ExpandablePanel;
