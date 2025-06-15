
import { useMemo } from 'react';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getColumnChartConfig, CHART_COLORS } from '@/config/chartConfigs';
import { createDateTooltipFormatter } from '@/utils/chartHelpers';
import { CursorDataRow } from '@/pages/Index';
import { type AggregationPeriod } from '@/utils/dataAggregation';

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
        .map(([date, activeUsers]) => [
          new Date(date).getTime(),
          activeUsers.size 
        ])
        .sort((a, b) => a[0] - b[0]);
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
        .map(([date, activeUsers]) => [
          new Date(date).getTime(),
          activeUsers 
        ])
        .sort((a, b) => a[0] - b[0]);
    }
  }, [data, aggregationPeriod]);

  const getPeriodText = () => {
    switch (aggregationPeriod) {
      case 'week': return 'weekly';
      case 'month': return 'monthly';
      default: return 'daily';
    }
  };

  const options: Partial<HighchartsOptions> = {
    ...getColumnChartConfig(),
    xAxis: {
      ...getColumnChartConfig().xAxis,
      type: 'datetime'
    },
    tooltip: {
      formatter: createDateTooltipFormatter('Active Users')
    },
    plotOptions: {
      column: {
        ...getColumnChartConfig().plotOptions?.column,
        color: CHART_COLORS.primary[4] // Purple
      }
    },
    series: [{
      name: 'Active Users',
      type: 'column',
      data: chartData
    }]
  };

  return (
    <ChartContainer
      title={`Daily Team Engagement (${getPeriodText()})`}
      helpText={`Number of active users per ${aggregationPeriod}. Counts users where 'Is Active' field is true`}
    >
      <BaseHighchart options={options} />
    </ChartContainer>
  );
};

export default UserActivityChart;
