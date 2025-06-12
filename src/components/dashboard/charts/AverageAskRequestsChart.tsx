
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { formatPeriodLabel, type AggregationPeriod } from '@/utils/dataAggregation';

interface AverageAskRequestsChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const AverageAskRequestsChart = ({ data, aggregationPeriod }: AverageAskRequestsChartProps) => {
  const chartData = useMemo(() => {
    const periodData = new Map<string, { total: number; userDays: number }>();
    
    data.forEach(row => {
      const date = row.Date;
      const askRequests = parseInt(row['Ask Requests']) || 0;
      
      if (!periodData.has(date)) {
        periodData.set(date, { total: 0, userDays: 0 });
      }
      
      const period = periodData.get(date)!;
      period.total += askRequests;
      period.userDays += 1; // Count each user-day
    });

    return Array.from(periodData.entries())
      .map(([date, { total, userDays }]) => ({
        date,
        averageAskRequests: userDays > 0 ? Math.round((total / userDays) * 10) / 10 : 0,
        totalAskRequests: total,
        userDays,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const formatXAxisTick = (tickItem: string) => {
    try {
      return formatPeriodLabel(tickItem, aggregationPeriod);
    } catch {
      return tickItem;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{`Period: ${formatXAxisTick(label)}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              Average Ask Requests: {entry.value}
            </p>
          ))}
          {payload[0] && (
            <div className="text-sm text-muted-foreground mt-1">
              <p>Total: {payload[0].payload.totalAskRequests.toLocaleString()}</p>
              <p>User-Days: {payload[0].payload.userDays}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getPeriodText = () => {
    switch (aggregationPeriod) {
      case 'week': return 'weekly';
      case 'month': return 'monthly';
      default: return 'daily';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">Average Ask Requests ({getPeriodText()})</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows the average Ask Requests per user per {getPeriodText().slice(0, -2)} period.</p>
                <p className="text-sm text-muted-foreground mt-1">Calculated as Total Ask Requests ÷ Number of User-Days in period</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatXAxisTick}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="averageAskRequests" 
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
