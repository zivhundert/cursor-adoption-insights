
import { useMemo } from 'react';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getColumnChartConfig, CHART_COLORS } from '@/config/chartConfigs';
import { createDateTooltipFormatter } from '@/utils/chartHelpers';
import { CursorDataRow } from '@/pages/Index';
import { type AggregationPeriod } from '@/utils/dataAggregation';

interface ChatRequestTypesChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const ChatRequestTypesChart = ({ data, aggregationPeriod }: ChatRequestTypesChartProps) => {
  const chartData = useMemo(() => {
    const periodData = new Map<string, {
      agent: number;
      cmdK: number;
      ask: number;
      edit: number;
      bugbot: number;
    }>();

    // Filter out aggregated rows and process individual user data
    const userRows = data.filter(row => !row.Email.includes('active users'));
    
    userRows.forEach(row => {
      const date = row.Date;
      
      if (!periodData.has(date)) {
        periodData.set(date, {
          agent: 0,
          cmdK: 0,
          ask: 0,
          edit: 0,
          bugbot: 0,
        });
      }
      
      const dayData = periodData.get(date)!;
      dayData.agent += parseInt(row['Agent Requests']) || 0;
      dayData.cmdK += parseInt(row['Cmd+K Requests']) || 0;
      dayData.ask += parseInt(row['Ask Requests']) || 0;
      dayData.edit += parseInt(row['Edit Requests']) || 0;
      dayData.bugbot += parseInt(row['Bugbot Requests']) || 0;
    });

    // Convert to chart series format
    const dates = Array.from(periodData.keys()).sort();
    
    return {
      dates: dates.map(date => new Date(date).getTime()),
      agent: dates.map(date => periodData.get(date)!.agent),
      cmdK: dates.map(date => periodData.get(date)!.cmdK),
      ask: dates.map(date => periodData.get(date)!.ask),
      edit: dates.map(date => periodData.get(date)!.edit),
      bugbot: dates.map(date => periodData.get(date)!.bugbot),
    };
  }, [data]);

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
    yAxis: {
      ...getColumnChartConfig().yAxis,
      title: {
        text: 'Usage',
        style: {
          color: 'hsl(var(--foreground))'
        }
      }
    },
    tooltip: {
      formatter: createDateTooltipFormatter('Requests')
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderRadius: 2,
        pointPadding: 0.1,
        groupPadding: 0.15
      }
    },
    series: [
      {
        name: 'Agent',
        type: 'column',
        data: chartData.agent.map((value, index) => [chartData.dates[index], value]),
        color: CHART_COLORS.secondary[0], // Yellow/Gold
      },
      {
        name: 'Cmd+K',
        type: 'column',
        data: chartData.cmdK.map((value, index) => [chartData.dates[index], value]),
        color: CHART_COLORS.secondary[1], // Pink
      },
      {
        name: 'Ask',
        type: 'column',
        data: chartData.ask.map((value, index) => [chartData.dates[index], value]),
        color: CHART_COLORS.secondary[2], // Blue
      },
      {
        name: 'Edit',
        type: 'column',
        data: chartData.edit.map((value, index) => [chartData.dates[index], value]),
        color: CHART_COLORS.secondary[3], // Green
      },
      {
        name: 'Bugbot',
        type: 'column',
        data: chartData.bugbot.map((value, index) => [chartData.dates[index], value]),
        color: CHART_COLORS.secondary[4], // Purple
      },
    ]
  };

  return (
    <ChartContainer
      title={`Chat Request Types (${getPeriodText()})`}
      helpText="Breakdown of different chat request types over time. Shows Agent, Cmd+K, Ask, Edit, and Bugbot requests"
    >
      <BaseHighchart options={options} />
    </ChartContainer>
  );
};

export default ChatRequestTypesChart;
