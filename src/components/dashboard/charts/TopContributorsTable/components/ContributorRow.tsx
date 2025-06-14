
import { TableCell, TableRow } from '@/components/ui/table';
import { ContributorWithSegment } from '../types';
import { PerformanceSegmentBadge } from './PerformanceSegmentBadge';

interface ContributorRowProps {
  contributor: ContributorWithSegment;
}

export const ContributorRow = ({ contributor }: ContributorRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{contributor.email}</TableCell>
      <TableCell>
        <PerformanceSegmentBadge segment={contributor.segment} />
      </TableCell>
      <TableCell className="text-right">{contributor.acceptedLines.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.suggestedLines.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.acceptanceRate.toFixed(1)}%</TableCell>
      <TableCell className="text-right">{contributor.chatTotalApplies.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.tabsAccepted.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.editRequests.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.askRequests.toLocaleString()}</TableCell>
      <TableCell className="text-right">{contributor.agentRequests.toLocaleString()}</TableCell>
    </TableRow>
  );
};
