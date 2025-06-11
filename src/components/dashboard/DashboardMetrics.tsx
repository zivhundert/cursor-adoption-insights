
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CursorDataRow } from '@/pages/Index';

interface DashboardMetricsProps {
  data: CursorDataRow[];
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
    },
    {
      title: 'Equivalent Dev Hours Saved',
      value: metrics.estimatedHoursSaved,
      gradient: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers.toString(),
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Acceptance Rate',
      value: metrics.acceptanceRate,
      gradient: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className={`bg-gradient-to-br ${metric.gradient} text-white pb-2`}>
            <CardTitle className="text-sm font-medium opacity-90">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-900">
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
