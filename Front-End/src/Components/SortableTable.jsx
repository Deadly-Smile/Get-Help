/* eslint-disable react/prop-types */
import useSorting from "../Hooks/useSorting";
import Table from "./Table";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

const SortableTable = (props) => {
  const { config, data } = props;
  const { sortedData, handleSortingCritaria, sortBy, sortOrder } = useSorting(
    data,
    config
  );

  const getIcons = (title, sortBy, sortOrder) => {
    if (title === sortBy) {
      if (!sortOrder)
        return (
          <div>
            <GoChevronUp />
            <GoChevronDown />
          </div>
        );
      else if (sortOrder === "asc")
        return (
          <div>
            {" "}
            <GoChevronUp />
          </div>
        );
      else
        return (
          <div>
            <GoChevronDown />
          </div>
        );
    } else {
      return (
        <div>
          <GoChevronUp />
          <GoChevronDown />
        </div>
      );
    }
  };
  const updatedConfig = config.map((column) => {
    if (!column.sortValue) {
      return column;
    }
    return {
      ...column,
      header: (
        <th
          onClick={() => handleSortingCritaria(column.title)}
          className="cursor-pointer"
        >
          <div className="flex items-center">
            {getIcons(column.title, sortBy, sortOrder)}
            {column.title}
          </div>
        </th>
      ),
    };
  });

  return <Table {...props} config={updatedConfig} data={sortedData} />;
};

export default SortableTable;
