import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';

interface DashboardMetricsProps {
  data: CursorDataRow[];
  originalData: CursorDataRow[];
  baseFilteredData: CursorDataRow[]; // Data filtered by user/date but not by time period
}

export const DashboardMetrics = ({ data, originalData, baseFilteredData }: DashboardMetricsProps) => {
  const metrics = useMemo(() => {
    // Use baseFilteredData for totals (respects user/date filters but not time period)
    const totalAcceptedLines = baseFilteredData.reduce((sum, row) => {
      // Skip aggregated rows
      if (row.Email.includes('active users')) return sum;
      return sum + (parseInt(row['Chat Accepted Lines Added']) || 0);
    }, 0);

    const activeUsers = new Set(
      baseFilteredData
        .filter(row => !row.Email.includes('active users')) // Skip aggregated rows
        .filter(row => row['Is Active'] === 'true')
        .map(row => row.Email)
    ).size;

    // Calculate acceptance rate from filtered data (should be affected by time period)
    const filteredAcceptedLines = data.reduce((sum, row) => {
      return sum + (parseInt(row['Chat Accepted Lines Added']) || 0);
    }, 0);

    const filteredSuggestedLines = data.reduce((sum, row) => {
      return sum + (parseInt(row['Chat Suggested Lines Added']) || 0);
    }, 0);

    const acceptanceRate = filteredSuggestedLines > 0 
      ? ((filteredAcceptedLines / filteredSuggestedLines) * 100).toFixed(1)
      : '0';

    // Estimate dev hours saved (assuming 10 lines per minute on average)
    const estimatedHoursSaved = Math.round(totalAcceptedLines / (10 * 60));

    return {
      totalAcceptedLines: totalAcceptedLines.toLocaleString(),
      activeUsers,
      acceptanceRate: `${acceptanceRate}%`,
      estimatedHoursSaved: estimatedHoursSaved.toLocaleString(),
    };
  }, [data, originalData, baseFilteredData]);

  const metricCards = [
    {
      title: 'Accepted Lines (Total)',
      value: metrics.totalAcceptedLines,
      gradient: 'from-blue-500 to-blue-600',
      tooltip: 'Total sum of all accepted lines for the selected filters. Not affected by time period selection.',
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
      tooltip: 'Estimated development hours saved based on accepted lines for the selected filters. Not affected by time period selection.',
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers.toString(),
      gradient: 'from-indigo-500 to-indigo-600',
      tooltip: 'Number of unique active users for the selected filters. Not affected by time period selection.',
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
