
import { useMemo, useEffect, useState } from 'react';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getColumnChartConfig, CHART_COLORS } from '@/config/chartConfigs';
import { createCategoryTooltipFormatter } from '@/utils/chartHelpers';
import { CursorDataRow } from '@/pages/Index';

interface DayOfWeekChartProps {
  data: CursorDataRow[];
}

export const DayOfWeekChart = ({ data }: DayOfWeekChartProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const chartData = useMemo(() => {
    const dayOfWeekActivity = new Map<string, number>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Initialize all days
    dayNames.forEach(day => dayOfWeekActivity.set(day, 0));
    
    data.forEach(row => {
      const date = new Date(row.Date);
      const dayName = dayNames[date.getDay()];
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      dayOfWeekActivity.set(dayName, (dayOfWeekActivity.get(dayName) || 0) + acceptedLines);
    });

    return dayNames.map(day => [day, dayOfWeekActivity.get(day) || 0]);
  }, [data]);

  const options: Partial<HighchartsOptions> = {
    ...getColumnChartConfig(),
    chart: {
      ...getColumnChartConfig().chart,
      marginBottom: isMobile ? 120 : 100,
    },
    xAxis: {
      ...getColumnChartConfig().xAxis,
      labels: {
        rotation: isMobile ? -45 : 0,
        style: {
          fontSize: isMobile ? '10px' : '12px',
          color: 'hsl(var(--foreground))'
        },
        formatter: function() {
          const value = this.value as string;
          return isMobile ? value.substring(0, 3) : value;
        }
      }
    },
    tooltip: {
      formatter: createCategoryTooltipFormatter('Accepted Lines', (value) => value.toLocaleString())
    },
    plotOptions: {
      column: {
        ...getColumnChartConfig().plotOptions?.column,
        color: CHART_COLORS.gradients.blue[0]
      }
    },
    series: [{
      name: 'Accepted Lines',
      type: 'column',
      data: chartData
    }]
  };

  return (
    <ChartContainer
      title="Activity by Day of Week"
      helpText="Total accepted lines grouped by day of the week. Shows which days have the highest coding activity"
    >
      <BaseHighchart options={options} />
    </ChartContainer>
  );
};
