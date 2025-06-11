
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CursorDataRow } from '@/pages/Index';

interface DayOfWeekChartProps {
  data: CursorDataRow[];
}

export const DayOfWeekChart = ({ data }: DayOfWeekChartProps) => {
  const chartData = useMemo(() => {
    const dayTotals = new Map<string, number>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Initialize all days with 0
    dayNames.forEach(day => dayTotals.set(day, 0));
    
    data.forEach(row => {
      const date = new Date(row.Date);
      const dayOfWeek = dayNames[date.getDay()];
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      dayTotals.set(dayOfWeek, (dayTotals.get(dayOfWeek) || 0) + acceptedLines);
    });

    return dayNames.map(day => ({
      day,
      lines: dayTotals.get(day) || 0,
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Activity by Day of Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), 'Accepted Lines']}
              />
              <Bar 
                dataKey="lines" 
                fill="url(#dayGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="dayGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
