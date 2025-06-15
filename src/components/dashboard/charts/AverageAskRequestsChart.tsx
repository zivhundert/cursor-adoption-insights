
import { useMemo } from 'react';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getLineChartConfig, CHART_COLORS } from '@/config/chartConfigs';
import { createDateTooltipFormatter } from '@/utils/chartHelpers';
import { CursorDataRow } from '@/pages/Index';
import { type AggregationPeriod } from '@/utils/dataAggregation';

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
      .map(([date, { total, userDays }]) => [
        new Date(date).getTime(),
        userDays > 0 ? Math.round((total / userDays) * 10) / 10 : 0
      ])
      .sort((a, b) => a[0] - b[0]);
  }, [data]);

  const getPeriodText = () => {
    switch (aggregationPeriod) {
      case 'week': return 'weekly';
      case 'month': return 'monthly';
      default: return 'daily';
    }
  };

  const options: Partial<HighchartsOptions> = {
    ...getLineChartConfig(),
    tooltip: {
      formatter: createDateTooltipFormatter('Average Ask Requests')
    },
    plotOptions: {
      line: {
        color: CHART_COLORS.gradients.green[0],
        marker: { enabled: true },
      }
    },
    series: [{
      name: 'Average Ask Requests',
      type: 'line',
      data: chartData
    }]
  };

  return (
    <ChartContainer
      title={`AI Chat Usage per Developer (${getPeriodText()})`}
      helpText={`Shows the average Ask Requests per user per ${getPeriodText().slice(0, -2)} period. Calculated as Total Ask Requests ÷ Number of User-Days in period`}
    >
      <BaseHighchart options={options} />
    </ChartContainer>
  );
};
