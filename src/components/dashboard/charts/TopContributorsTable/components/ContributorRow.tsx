
import { TableCell, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ContributorWithSegment } from '../types';
import { PerformanceSegmentBadge } from './PerformanceSegmentBadge';
import { useTableHover } from './TableHoverContext';
import { useSettings } from "@/contexts/SettingsContext";

interface ContributorRowProps {
  contributor: ContributorWithSegment;
}

export const ContributorRow = ({ contributor }: ContributorRowProps) => {
  const { highlightedColumns, hoveredEmail } = useTableHover();
  const { settings } = useSettings();

  // Calculate debug values for this user's ROI
  const estimatedHoursSaved = contributor.acceptedLines / (settings.linesPerMinute * 60);
  const individualMoneySaved = estimatedHoursSaved * settings.pricePerHour;
  const annualCursorCostPerUser = settings.cursorPricePerUser * 12;

  const getCellClassName = (columnKey: string) => {
    const baseClass = "text-right transition-colors duration-200";
    const isHighlighted = highlightedColumns.includes(columnKey) && hoveredEmail === contributor.email;
    return isHighlighted 
      ? `${baseClass} bg-green-200/70 dark:bg-green-900/20 font-bold` 
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
      <TableCell className={getCellClassName('userROI')}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{contributor.userROI.toFixed(1)}%</span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 text-sm">
                <div><strong>DEBUG - User ROI Calculation:</strong></div>
                <div>• Accepted Lines: {contributor.acceptedLines.toLocaleString()}</div>
                <div>• Hours Saved: {estimatedHoursSaved.toFixed(2)}</div>
                <div>• Money Saved: ${individualMoneySaved.toLocaleString()}</div>
                <div>• Annual Cursor Cost/User: ${annualCursorCostPerUser.toLocaleString()}</div>
                <div>• ROI: (${individualMoneySaved.toLocaleString()} ÷ ${annualCursorCostPerUser.toLocaleString()}) × 100 = {contributor.userROI.toFixed(1)}%</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};
