
import React, { createContext, useContext, useState } from 'react';

interface TableHoverContextType {
  hoveredEmail: string | null;
  setHoveredEmail: (email: string | null) => void;
  highlightedColumns: string[];
  setHighlightedColumns: (columns: string[]) => void;
}

const TableHoverContext = createContext<TableHoverContextType | undefined>(undefined);

export const TableHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);
  const [highlightedColumns, setHighlightedColumns] = useState<string[]>([]);

  return (
    <TableHoverContext.Provider value={{
      hoveredEmail,
      setHoveredEmail,
      highlightedColumns,
      setHighlightedColumns
    }}>
      {children}
    </TableHoverContext.Provider>
  );
};

export const useTableHover = () => {
  const context = useContext(TableHoverContext);
  if (context === undefined) {
    throw new Error('useTableHover must be used within a TableHoverProvider');
  }
  return context;
};
