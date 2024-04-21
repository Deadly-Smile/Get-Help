/* eslint-disable react/prop-types */
import { Fragment } from "react";

const Table = ({ data, config, getKey }) => {
  if (!data) {
    return null;
  }
  const renderedRows = data.map((product) => {
    const renderedCells = config.map((column) => {
      return <td key={`${column.title}`}>{column.render(product)}</td>;
    });
    return <tr key={getKey(product)}>{renderedCells}</tr>;
  });
  const tableHeaders = config.map((column) => {
    if (column.header) {
      return <Fragment key={column.title}>{column.header}</Fragment>;
    }
    return <th key={column.title}>{column.title}</th>;
  });
  return (
    <div className="overflow-x-auto min-h-[60vh]">
      <table className="table">
        <thead>
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
    </div>
  );
};

export default Table;
