// import React from "react";

const FieldError = ({ fieldType, result }) => {
  let render = null;
  if (result.data !== undefined) {
    render = result.data[`${fieldType}`];
  }
  return (
    <div className="form-text">
      <p className="text-danger">{render}</p>
    </div>
  );
};

export default FieldError;
