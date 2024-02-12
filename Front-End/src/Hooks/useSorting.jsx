import { useState } from "react";
const useSorting = (data, config) => {
  const [sortOrder, setSortOrder] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const handleSortingCritaria = (title) => {
    if (sortBy && title !== sortBy) {
      setSortBy(title);
      setSortOrder("asc");
      return;
    }
    if (sortOrder === null) {
      setSortOrder("asc");
      setSortBy(title);
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
      setSortBy(title);
    } else {
      setSortOrder(null);
      setSortBy(null);
    }
  };
  let sortedData = data;
  if (sortBy && sortOrder) {
    const { sortValue } = config.find((column) => column.title === sortBy);
    sortedData = [...data].sort((a, b) => {
      const valA = sortValue(a);
      const valB = sortValue(b);

      const decideOrder = sortOrder === "asc" ? 1 : -1;
      if (typeof valA === "string")
        return valA.localeCompare(valB) * decideOrder;
      return (valA - valB) * decideOrder;
    });
  }
  return {
    sortedData,
    handleSortingCritaria,
    sortBy,
    sortOrder,
  };
};

export default useSorting;
