
import { useMemo } from 'react';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getPieChartConfig, CHART_COLORS } from '@/config/chartConfigs';
import { CursorDataRow } from '@/pages/Index';

interface ModelUsageChartProps {
  data: CursorDataRow[];
}

export const ModelUsageChart = ({ data }: ModelUsageChartProps) => {
  const chartData = useMemo(() => {
    const modelCounts = new Map<string, number>();
    
    data.forEach(row => {
      const model = row['Most Used Model'] || 'No Model';
      modelCounts.set(model, (modelCounts.get(model) || 0) + 1);
    });

    return Array.from(modelCounts.entries())
      .map(([name, y], index) => ({ 
        name, 
        y, 
        color: CHART_COLORS.primary[index % CHART_COLORS.primary.length] 
      }))
      .sort((a, b) => b.y - a.y);
  }, [data]);

  const options: Partial<HighchartsOptions> = {
    ...getPieChartConfig(),
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    series: [{
      name: 'Model Usage',
      type: 'pie',
      data: chartData
    }]
  };

  return (
    <ChartContainer
      title="AI Model Usage"
      helpText="Distribution of AI models used by all users. Based on 'Most Used Model' field per user session"
    >
      <BaseHighchart options={options} />
    </ChartContainer>
  );
};
