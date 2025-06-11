
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { CursorDataRow } from '@/pages/Index';

interface CumulativeChartProps {
  data: CursorDataRow[];
}

export const CumulativeChart = ({ data }: CumulativeChartProps) => {
  const chartData = useMemo(() => {
    const dailyTotals = new Map<string, number>();
    
    data.forEach(row => {
      const date = row.Date;
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      dailyTotals.set(date, (dailyTotals.get(date) || 0) + acceptedLines);
    });

    const sortedDates = Array.from(dailyTotals.keys()).sort();
    let cumulative = 0;
    
    return sortedDates.map(date => {
      cumulative += dailyTotals.get(date) || 0;
      return {
        date,
        cumulative,
        daily: dailyTotals.get(date) || 0,
      };
    });
  }, [data]);

  const formatXAxisTick = (tickItem: string) => {
    try {
      const date = new Date(tickItem);
      return format(date, 'MMM dd');
    } catch {
      return tickItem;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">Cumulative Accepted Lines</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows the running total of accepted lines over time. Each day adds to the previous total.</p>
                <p className="text-sm text-muted-foreground mt-1">Formula: Daily sum of 'Chat Accepted Lines Added' field</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), 'Cumulative Lines']}
                labelFormatter={(label) => `Date: ${formatXAxisTick(label)}`}
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="url(#colorGradient)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#0891b2' }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
