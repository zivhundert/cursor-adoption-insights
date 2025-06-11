
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CursorDataRow } from '@/pages/Index';

interface ModelUsageChartProps {
  data: CursorDataRow[];
}

const COLORS = ['#1e40af', '#0891b2', '#0d9488', '#059669', '#10b981'];

export const ModelUsageChart = ({ data }: ModelUsageChartProps) => {
  const chartData = useMemo(() => {
    const modelTotals = new Map<string, number>();
    
    data.forEach(row => {
      const model = row['Most Used Model'] || 'Unknown';
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      modelTotals.set(model, (modelTotals.get(model) || 0) + acceptedLines);
    });

    return Array.from(modelTotals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 models
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Accepted Lines by Model</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Lines']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
