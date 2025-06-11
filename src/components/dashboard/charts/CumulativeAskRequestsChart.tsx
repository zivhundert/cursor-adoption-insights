
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { formatPeriodLabel, type AggregationPeriod } from '@/utils/dataAggregation';

interface CumulativeAskRequestsChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const CumulativeAskRequestsChart = ({ data, aggregationPeriod }: CumulativeAskRequestsChartProps) => {
  const chartData = useMemo(() => {
    const dailyAskRequests = new Map<string, number>();
    
    data.forEach(row => {
      const date = row.Date;
      const askRequests = parseInt(row['Ask Requests']) || 0;
      
      dailyAskRequests.set(date, (dailyAskRequests.get(date) || 0) + askRequests);
    });

    const sortedDates = Array.from(dailyAskRequests.keys()).sort();
    let cumulativeAskRequests = 0;
    
    return sortedDates.map(date => {
      cumulativeAskRequests += dailyAskRequests.get(date) || 0;
      
      return {
        date,
        cumulativeAskRequests,
        dailyAskRequests: dailyAskRequests.get(date) || 0,
      };
    });
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
          <p className="font-medium mb-2">{`Date: ${formatXAxisTick(label)}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'cumulativeAskRequests' && `Cumulative Ask Requests: ${entry.value.toLocaleString()}`}
            </p>
          ))}
          {payload[0] && (
            <p className="text-sm text-muted-foreground mt-1">
              Period Total: {payload[0].payload.dailyAskRequests.toLocaleString()}
            </p>
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
          <CardTitle className="text-xl font-semibold">Cumulative Ask Requests ({getPeriodText()})</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows the running total of Ask Requests over time aggregated by {getPeriodText()} periods.</p>
                <p className="text-sm text-muted-foreground mt-1">Tracks cumulative 'Ask Requests' from the data</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="askRequestsGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
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
              <Line 
                type="monotone" 
                dataKey="cumulativeAskRequests" 
                stroke="url(#askRequestsGradient)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#22c55e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
