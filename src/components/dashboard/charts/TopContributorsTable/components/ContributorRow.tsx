
import { TableCell, TableRow } from '@/components/ui/table';
import { ContributorWithSegment } from '../types';
import { PerformanceSegmentBadge } from './PerformanceSegmentBadge';
import { useTableHover } from './TableHoverContext';

interface ContributorRowProps {
  contributor: ContributorWithSegment;
}

export const ContributorRow = ({ contributor }: ContributorRowProps) => {
  const { highlightedColumns } = useTableHover();

  const getCellClassName = (columnKey: string) => {
    const baseClass = "text-right transition-colors duration-200";
    const isHighlighted = highlightedColumns.includes(columnKey);
    return isHighlighted 
      ? `${baseClass} bg-blue-50 dark:bg-blue-900/20` 
      : baseClass;
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{contributor.email}</TableCell>
      <TableCell>
        <PerformanceSegmentBadge segment={contributor.segment} contributor={contributor} />
      </TableCell>
      <TableCell className="text-right">{contributor.acceptedLines.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.suggestedLines.toLocaleString()}</TableCell>
      <TableCell className={getCellClassName('acceptanceRate')}>{contributor.acceptanceRate.toFixed(1)}%</TableCell>
      <TableCell className={getCellClassName('chatTotalApplies')}>{contributor.chatTotalApplies.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.tabsAccepted.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.editRequests.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.askRequests.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.agentRequests.toLocaleString()}</TableCell>
      <TableCell className={getCellClassName('userROI')}>{contributor.userROI.toFixed(1)}%</TableCell>
    </TableRow>
  );
};
