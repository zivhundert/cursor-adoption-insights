
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CursorDataRow } from '@/pages/Index';

interface UserActivityChartProps {
  data: CursorDataRow[];
}

export const UserActivityChart = ({ data }: UserActivityChartProps) => {
  const chartData = useMemo(() => {
    const userTotals = new Map<string, number>();
    
    data.forEach(row => {
      const email = row.Email;
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      userTotals.set(email, (userTotals.get(email) || 0) + acceptedLines);
    });

    return Array.from(userTotals.entries())
      .map(([email, lines]) => ({ 
        user: email.split('@')[0], // Show username part only
        lines 
      }))
      .sort((a, b) => b.lines - a.lines)
      .slice(0, 10); // Top 10 users
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Avg Accepted Lines per User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="category"
                dataKey="user" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [value.toLocaleString(), 'Lines']}
              />
              <Bar 
                dataKey="lines" 
                fill="url(#barGradient)"
                radius={[0, 4, 4, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
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
