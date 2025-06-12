
import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { formatPeriodLabel, type AggregationPeriod } from '@/utils/dataAggregation';

interface CumulativeTabsAcceptedChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const CumulativeTabsAcceptedChart = ({ data, aggregationPeriod }: CumulativeTabsAcceptedChartProps) => {
  const chartData = useMemo(() => {
    const dailyTabsAccepted = new Map<string, number>();
    
    data.forEach(row => {
      const date = row.Date;
      const tabsAccepted = parseInt(row['Tabs Accepted']) || 0;
      
      dailyTabsAccepted.set(date, (dailyTabsAccepted.get(date) || 0) + tabsAccepted);
    });

    const sortedDates = Array.from(dailyTabsAccepted.keys()).sort();
    let cumulativeTabsAccepted = 0;
    
    return sortedDates.map(date => {
      cumulativeTabsAccepted += dailyTabsAccepted.get(date) || 0;
      
      return {
        date,
        cumulativeTabsAccepted,
        dailyTabsAccepted: dailyTabsAccepted.get(date) || 0,
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
              {entry.dataKey === 'cumulativeTabsAccepted' && `Cumulative Tabs Accepted: ${entry.value.toLocaleString()}`}
            </p>
          ))}
          {payload[0] && (
            <p className="text-sm text-muted-foreground mt-1">
              Period Total: {payload[0].payload.dailyTabsAccepted.toLocaleString()}
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
          <CardTitle className="text-xl font-semibold">Cumulative Tabs Accepted ({getPeriodText()})</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows the running total of Tabs Accepted over time aggregated by {getPeriodText()} periods.</p>
                <p className="text-sm text-muted-foreground mt-1">Area chart makes cumulative growth more visually apparent</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tabsAcceptedAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.1} />
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
              <Area 
                type="monotone" 
                dataKey="cumulativeTabsAccepted" 
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#tabsAcceptedAreaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
