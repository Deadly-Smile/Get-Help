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
    return (
      <th className="px-6 py-4" key={column.title}>
        {column.title}
      </th>
    );
  });
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="table-auto border-spacing-2">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                  {tableHeaders}
                </tr>
              </thead>
              <tbody className="border-b dark:border-neutral-500 text-center">
                {renderedRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
