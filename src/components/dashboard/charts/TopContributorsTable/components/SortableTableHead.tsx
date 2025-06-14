
import { TableHead } from '@/components/ui/table';
import { SortableColumn } from '../types';
import { getAriaSort } from '../sorting';

interface SortableTableHeadProps {
  column: SortableColumn;
  label: string;
  sortConfig: { column: SortableColumn; direction: "asc" | "desc" };
  onSort: (column: SortableColumn) => void;
  className?: string;
}

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <span className="inline-block w-3 ml-1">
      {active ? (direction === "asc" ? "▲" : "▼") : ""}
    </span>
  );
}

export const SortableTableHead = ({ 
  column, 
  label, 
  sortConfig, 
  onSort, 
  className = "" 
}: SortableTableHeadProps) => {
  // Determine alignment based on column type
  const isTextColumn = column === 'email' || column === 'segment';
  const alignmentClass = isTextColumn ? 'text-left' : 'text-center';
  
  return (
    <TableHead
      className={`cursor-pointer select-none ${alignmentClass} ${className}`}
      onClick={() => onSort(column)}
      aria-sort={getAriaSort(column, sortConfig)}
    >
      {label}
      <SortIcon active={sortConfig.column === column} direction={sortConfig.direction} />
    </TableHead>
  );
};
