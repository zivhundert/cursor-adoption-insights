
import { useState } from 'react';
import { SortableColumn } from './types';

export const useTableSorting = () => {
  const [sortConfig, setSortConfig] = useState<{ column: SortableColumn; direction: "asc" | "desc" }>({
    column: "segment",
    direction: "asc",
  });

  const handleSort = (column: SortableColumn) => {
    setSortConfig(prev => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      if (column === "email" || column === "segment") {
        return { column, direction: "asc" };
      }
      return { column, direction: "desc" };
    });
  };

  return { sortConfig, handleSort };
};

export const useDisplaySettings = () => {
  const [showAll, setShowAll] = useState(false);
  
  const toggleShowAll = () => setShowAll(!showAll);
  
  return { showAll, toggleShowAll };
};
