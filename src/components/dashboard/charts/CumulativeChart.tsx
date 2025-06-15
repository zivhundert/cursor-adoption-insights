
import { useMemo } from 'react';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getLineChartConfig, CHART_COLORS } from '@/config/chartConfigs';
import { createDateTooltipFormatter } from '@/utils/chartHelpers';
import { CursorDataRow } from '@/pages/Index';
import { formatPeriodLabel, type AggregationPeriod } from '@/utils/dataAggregation';
import { startOfWeek, startOfMonth, format } from 'date-fns';

interface CumulativeChartProps {
  baseFilteredData: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const CumulativeChart = ({ baseFilteredData, aggregationPeriod }: CumulativeChartProps) => {
  const chartData = useMemo(() => {
    // Group baseFilteredData by the selected period
    const groupKey = (date: Date) => {
      if (aggregationPeriod === 'week') {
        return startOfWeek(date, { weekStartsOn: 1 }).getTime();
      } else if (aggregationPeriod === 'month') {
        return startOfMonth(date).getTime();
      } else {
        return date.getTime();
      }
    };

    // Filter out aggregated rows and group by period
    const periodData = new Map<number, { accepted: number; suggested: number }>();
    
    baseFilteredData
      .filter(row => !row.Email.includes('active users')) // Skip aggregated rows
      .forEach(row => {
        const date = new Date(row.Date);
        const key = groupKey(date);
        const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
        const suggestedLines = parseInt(row['Chat Suggested Lines Added']) || 0;
        
        if (!periodData.has(key)) {
          periodData.set(key, { accepted: 0, suggested: 0 });
        }
        const existing = periodData.get(key)!;
        existing.accepted += acceptedLines;
        existing.suggested += suggestedLines;
      });

    // Convert to sorted array and calculate cumulative sums
    const sortedData = Array.from(periodData.entries())
      .sort(([a], [b]) => a - b);

    let cumulativeAccepted = 0;
    let cumulativeSuggested = 0;
    
    return sortedData.map(([timestamp, { accepted, suggested }]) => {
      cumulativeAccepted += accepted;
      cumulativeSuggested += suggested;
      return {
        date: timestamp,
        cumulativeAccepted,
        cumulativeSuggested,
      };
    });
  }, [baseFilteredData, aggregationPeriod]);

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
      formatter: createDateTooltipFormatter('Cumulative Value', (value) => value.toLocaleString())
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    },
    series: [
      {
        name: 'Cumulative Accepted',
        type: 'line',
        data: chartData.map(d => [d.date, d.cumulativeAccepted]),
        color: CHART_COLORS.gradients.blue[0]
      },
      {
        name: 'Cumulative Suggested',
        type: 'line',
        data: chartData.map(d => [d.date, d.cumulativeSuggested]),
        color: CHART_COLORS.gradients.orange[0],
        dashStyle: 'Dash'
      }
    ]
  };

  return (
    <ChartContainer
      title={`AI Code Generation Growth (${getPeriodText()})`}
      helpText={`Shows the running total of accepted and suggested lines over time aggregated by ${getPeriodText()} periods. Solid line: Cumulative 'Chat Accepted Lines Added', Dashed line: Cumulative 'Chat Suggested Lines Added'`}
    >
      <BaseHighchart options={options} />
    </ChartContainer>
  );
};
