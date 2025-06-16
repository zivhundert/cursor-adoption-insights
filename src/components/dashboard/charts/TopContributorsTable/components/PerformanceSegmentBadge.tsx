
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PerformanceSegment, ContributorWithSegment } from '../types';
import { getSegmentIcon, getSegmentBadgeStyle, getSegmentCalculationExplanation } from '../performanceSegments';
import { useTableHover } from './TableHoverContext';

interface PerformanceSegmentBadgeProps {
  segment: PerformanceSegment;
  contributor: ContributorWithSegment;
}

export const PerformanceSegmentBadge = ({ segment, contributor }: PerformanceSegmentBadgeProps) => {
  const { setHighlightedColumns } = useTableHover();

  const handleMouseEnter = () => {
    setHighlightedColumns(['acceptanceRate', 'chatTotalApplies', 'userROI']);
  };

  const handleMouseLeave = () => {
    setHighlightedColumns([]);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {getSegmentIcon(segment)}
            <Badge
              className={`${getSegmentBadgeStyle(segment)} transition-colors duration-150 group-hover:text-white group-focus:text-white`}
            >
              {segment}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent
          className="bg-popover text-popover-foreground border border-slate-300 dark:border-slate-700 max-w-xs shadow-lg px-4 py-2 rounded-lg font-medium text-sm leading-relaxed"
        >
          <pre className="whitespace-pre-wrap font-mono text-xs">
            {getSegmentCalculationExplanation(
              segment,
              contributor.acceptanceRate,
              contributor.chatTotalApplies,
              contributor.userROI
            )}
          </pre>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
