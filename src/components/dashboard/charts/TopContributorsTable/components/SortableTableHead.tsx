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
  // Determine alignment based on column type - match data cell alignment
  const isTextColumn = column === 'email' || column === 'segment';
  const alignmentClass = isTextColumn ? 'text-left' : 'text-right';
  
  // Check if this column is currently being sorted
  const isActiveSortColumn = sortConfig.column === column;
  const fontWeight = isActiveSortColumn ? 'font-bold' : 'font-medium';
  const textColor = isActiveSortColumn ? 'text-black' : 'text-muted-foreground';
  
  return (
    <TableHead
      className={`cursor-pointer select-none ${alignmentClass} ${className} min-w-0 break-words leading-tight`}
      onClick={() => onSort(column)}
      aria-sort={getAriaSort(column, sortConfig)}
    >
      <div className="flex flex-col items-center justify-center min-h-[2.5rem]">
        <span className={`text-center text-xs ${fontWeight} ${textColor} leading-tight`}>
          {label}
        </span>
        <SortIcon active={isActiveSortColumn} direction={sortConfig.direction} />
      </div>
    </TableHead>
  );
};
