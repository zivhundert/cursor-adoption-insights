
import { useMemo } from 'react';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getLineChartConfig, CHART_COLORS } from '@/config/chartConfigs';
import { createDateTooltipFormatter } from '@/utils/chartHelpers';
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod } from '@/utils/dataAggregation';

interface AverageTabsAcceptedChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const AverageTabsAcceptedChart = ({ data, aggregationPeriod }: AverageTabsAcceptedChartProps) => {
  const chartData = useMemo(() => {
    const periodData = new Map<string, { total: number; userDays: number }>();
    
    data.forEach(row => {
      const date = row.Date;
      const tabsAccepted = parseInt(row['Tabs Accepted']) || 0;
      
      if (!periodData.has(date)) {
        periodData.set(date, { total: 0, userDays: 0 });
      }
      
      const period = periodData.get(date)!;
      period.total += tabsAccepted;
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
      formatter: createDateTooltipFormatter('Average Tabs Accepted')
    },
    plotOptions: {
      line: {
        ...getLineChartConfig().plotOptions?.line,
        color: CHART_COLORS.gradients.purple[0],
        marker: { 
          enabled: true,
          fillColor: CHART_COLORS.gradients.purple[0],
          lineColor: CHART_COLORS.gradients.purple[1],
          lineWidth: 2
        }
      }
    },
    series: [{
      name: 'Average Tabs Accepted',
      type: 'line',
      data: chartData
    }]
  };

  return (
    <ChartContainer
      title={`Code Completions per Developer (${getPeriodText()})`}
      helpText={`Shows the average Tabs Accepted per user per ${getPeriodText().slice(0, -2)} period. Calculated as Total Tabs Accepted ÷ Number of User-Days in period`}
    >
      <BaseHighchart options={options} />
    </ChartContainer>
  );
};
