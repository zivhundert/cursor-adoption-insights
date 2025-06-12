import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { formatPeriodLabel, type AggregationPeriod } from '@/utils/dataAggregation';

interface UserActivityChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const UserActivityChart = ({ data, aggregationPeriod }: UserActivityChartProps) => {
  const chartData = useMemo(() => {
    if (aggregationPeriod === 'day') {
      const periodActivity = new Map<string, Set<string>>();
      
      data.forEach(row => {
        const date = row.Date;
        const isActive = row['Is Active'].toLowerCase() === 'true';
        if (isActive) {
          if (!periodActivity.has(date)) {
            periodActivity.set(date, new Set());
          }
          periodActivity.get(date)!.add(row.Email);
        }
      });

      return Array.from(periodActivity.entries())
        .map(([date, activeUsers]) => ({ 
          date,
          activeUsers: activeUsers.size 
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      // For weekly/monthly, use the aggregated data
      const aggregatedRows = data.filter(row => row.Email.includes('active users'));
      const periodActivity = new Map<string, number>();
      
      aggregatedRows.forEach(row => {
        const date = row.Date;
        const activeUsersText = row.Email;
        const activeUsersCount = parseInt(activeUsersText.split(' ')[0]) || 0;
        periodActivity.set(date, activeUsersCount);
      });

      return Array.from(periodActivity.entries())
        .map(([date, activeUsers]) => ({ 
          date,
          activeUsers 
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  }, [data, aggregationPeriod]);

  const formatXAxisTick = (tickItem: string) => {
    try {
      return formatPeriodLabel(tickItem, aggregationPeriod);
    } catch {
      return tickItem;
    }
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
          <CardTitle className="text-xl font-semibold">Active Users ({getPeriodText()})</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of active users per {aggregationPeriod}.</p>
                <p className="text-sm text-muted-foreground mt-1">Counts users where 'Is Active' field is true</p>
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
              />
              <Tooltip 
                formatter={(value: number) => [value, 'Active Users']}
                labelFormatter={formatXAxisTick}
              />
              <Bar dataKey="activeUsers" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
