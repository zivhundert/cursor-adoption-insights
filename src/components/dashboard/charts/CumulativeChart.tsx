
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
    const dailyAccepted = new Map<string, number>();
    const dailySuggested = new Map<string, number>();
    
    data.forEach(row => {
      const date = row.Date;
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      const suggestedLines = parseInt(row['Chat Suggested Lines Added']) || 0;
      
      dailyAccepted.set(date, (dailyAccepted.get(date) || 0) + acceptedLines);
      dailySuggested.set(date, (dailySuggested.get(date) || 0) + suggestedLines);
    });

    const sortedDates = Array.from(new Set([...dailyAccepted.keys(), ...dailySuggested.keys()])).sort();
    let cumulativeAccepted = 0;
    let cumulativeSuggested = 0;
    
    return sortedDates.map(date => {
      cumulativeAccepted += dailyAccepted.get(date) || 0;
      cumulativeSuggested += dailySuggested.get(date) || 0;
      
      return {
        date,
        cumulativeAccepted,
        cumulativeSuggested,
        dailyAccepted: dailyAccepted.get(date) || 0,
        dailySuggested: dailySuggested.get(date) || 0,
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{`Date: ${formatXAxisTick(label)}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'cumulativeAccepted' && `Cumulative Accepted: ${entry.value.toLocaleString()}`}
              {entry.dataKey === 'cumulativeSuggested' && `Cumulative Suggested: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
                <p>Shows the running total of accepted and suggested lines over time. Each day adds to the previous total.</p>
                <p className="text-sm text-muted-foreground mt-1">Solid line: Cumulative 'Chat Accepted Lines Added'</p>
                <p className="text-sm text-muted-foreground">Dashed line: Cumulative 'Chat Suggested Lines Added'</p>
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
                <linearGradient id="acceptedGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <linearGradient id="suggestedGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#ea580c" />
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
                dataKey="cumulativeAccepted" 
                stroke="url(#acceptedGradient)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#0891b2' }}
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeSuggested" 
                stroke="url(#suggestedGradient)"
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 6, fill: '#ea580c' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
