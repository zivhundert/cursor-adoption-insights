
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';

interface DashboardMetricsProps {
  data: CursorDataRow[];
  originalData: CursorDataRow[];
}

export const DashboardMetrics = ({ data }: DashboardMetricsProps) => {
  const metrics = useMemo(() => {
    const totalAcceptedLines = data.reduce((sum, row) => {
      return sum + (parseInt(row['Chat Accepted Lines Added']) || 0);
    }, 0);

    const totalSuggestedLines = data.reduce((sum, row) => {
      return sum + (parseInt(row['Chat Suggested Lines Added']) || 0);
    }, 0);

    const activeUsers = new Set(
      data.filter(row => row['Is Active'] === 'true').map(row => row.Email)
    ).size;

    const acceptanceRate = totalSuggestedLines > 0 
      ? ((totalAcceptedLines / totalSuggestedLines) * 100).toFixed(1)
      : '0';

    // Estimate dev hours saved (assuming 10 lines per minute on average)
    const estimatedHoursSaved = Math.round(totalAcceptedLines / (10 * 60));

    return {
      totalAcceptedLines: totalAcceptedLines.toLocaleString(),
      activeUsers,
      acceptanceRate: `${acceptanceRate}%`,
      estimatedHoursSaved: estimatedHoursSaved.toLocaleString(),
    };
  }, [data]);

  const metricCards = [
    {
      title: 'Accepted Lines (Total)',
      value: metrics.totalAcceptedLines,
      gradient: 'from-blue-500 to-blue-600',
      tooltip: 'Sum of all accepted lines for the current selection. These are lines that were suggested by AI and accepted by users in the filtered data.',
    },
    {
      title: 'Acceptance Rate',
      value: metrics.acceptanceRate,
      gradient: 'from-emerald-500 to-emerald-600',
      tooltip: 'Percentage of suggested lines that were accepted in the current selection. Formula: (Accepted Lines / Suggested Lines) × 100',
    },
    {
      title: 'Equivalent Dev Hours Saved',
      value: metrics.estimatedHoursSaved,
      gradient: 'from-teal-500 to-teal-600',
      tooltip: 'Estimated development hours saved based on accepted lines in the current selection. Calculated assuming 10 lines of code per minute (600 lines per hour).',
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers.toString(),
      gradient: 'from-indigo-500 to-indigo-600',
      tooltip: 'Number of unique users marked as active in the current selection (filtered by date range and other filters).',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className={`bg-gradient-to-br ${metric.gradient} text-white pb-2`}>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium opacity-90">
                {metric.title}
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-white opacity-75" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{metric.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
