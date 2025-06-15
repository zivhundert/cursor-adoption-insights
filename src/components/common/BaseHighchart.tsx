
import { useMemo } from 'react';
import Highcharts, { Options as HighchartsOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getBaseChartConfig } from '@/config/chartConfigs';

interface BaseHighchartProps {
  options: Partial<HighchartsOptions>;
  className?: string;
}

export const BaseHighchart = ({ options, className }: BaseHighchartProps) => {
  const mergedOptions = useMemo(() => {
    const baseConfig = getBaseChartConfig();
    return {
      ...baseConfig,
      ...options,
      chart: {
        ...baseConfig.chart,
        ...options.chart
      },
      tooltip: {
        ...baseConfig.tooltip,
        ...options.tooltip
      },
      legend: {
        ...baseConfig.legend,
        ...options.legend
      }
    };
  }, [options]);

  return (
    <div className={className}>
      <HighchartsReact
        highcharts={Highcharts}
        options={mergedOptions}
      />
    </div>
  );
};
