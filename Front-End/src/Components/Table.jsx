/* eslint-disable react/prop-types */
import { Fragment } from "react";

const Table = ({ data, config, getKey }) => {
  if (!data) {
    return null;
  }
  const renderedRows = data.map((product) => {
    const renderedCells = config.map((column) => {
      return (
        <td key={`${column.title}`} className="p-3">
          {column.render(product)}
        </td>
      );
    });
    return (
      <tr className="border-b" key={getKey(product)}>
        {renderedCells}
      </tr>
    );
  });
  const tableHeaders = config.map((column) => {
    if (column.header) {
      return <Fragment key={column.title}>{column.header}</Fragment>;
    }
    return <th key={column.title}>{column.title}</th>;
  });
  return (
    <table className="table-auto border-spacing-2">
      <thead>
        <tr className="border-b-2">{tableHeaders}</tr>
      </thead>
      <tbody>{renderedRows}</tbody>
    </table>
  );
};

export default Table;
