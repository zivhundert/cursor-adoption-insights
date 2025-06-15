
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PerformanceSegment } from '../types';
import { getSegmentIcon, getSegmentBadgeStyle, getSegmentDescription } from '../performanceSegments';

interface PerformanceSegmentBadgeProps {
  segment: PerformanceSegment;
}

export const PerformanceSegmentBadge = ({ segment }: PerformanceSegmentBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            {getSegmentIcon(segment)}
            <Badge className={getSegmentBadgeStyle(segment)}>
              {segment}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent
          className="bg-popover text-popover-foreground border border-slate-300 dark:border-slate-700 max-w-xs shadow-lg px-4 py-2 rounded-lg font-medium text-sm leading-relaxed"
        >
          <p>{getSegmentDescription(segment)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
