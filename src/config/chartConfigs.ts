
import { Options as HighchartsOptions } from 'highcharts';

// Common color schemes
export const CHART_COLORS = {
  primary: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'],
  secondary: ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6'],
  gradients: {
    blue: ['#0891b2', '#0369a1'],
    green: ['#16a34a', '#15803d'],
    purple: ['#7c3aed', '#6d28d9'],
    orange: ['#ea580c', '#c2410c']
  }
};

// Base chart configuration
export const getBaseChartConfig = (): Partial<HighchartsOptions> => ({
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, sans-serif'
    },
    marginBottom: 100,
  },
  title: {
    text: undefined
  },
  credits: {
    enabled: false
  },
  tooltip: {
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--border))',
    style: {
      color: 'hsl(var(--foreground))'
    }
  },
  legend: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom',
    y: -10,
    itemStyle: {
      color: 'hsl(var(--foreground))'
    }
  }
});

// Axis configuration
export const getAxisConfig = () => ({
  gridLineColor: 'hsl(var(--border))',
  lineColor: 'hsl(var(--border))',
  tickColor: 'hsl(var(--border))',
  labels: {
    style: {
      color: 'hsl(var(--foreground))'
    }
  }
});

// Chart type specific configurations
export const getLineChartConfig = (): Partial<HighchartsOptions> => ({
  ...getBaseChartConfig(),
  chart: {
    ...getBaseChartConfig().chart,
    type: 'line'
  },
  xAxis: {
    type: 'datetime',
    title: { text: null },
    ...getAxisConfig()
  },
  yAxis: {
    title: { text: null },
    ...getAxisConfig(),
    labels: {
      ...getAxisConfig().labels,
      formatter: function() {
        return this.value?.toLocaleString() || '';
      }
    }
  },
  plotOptions: {
    line: {
      marker: {
        enabled: false,
        states: {
          hover: { enabled: true }
        }
      }
    }
  }
});

export const getColumnChartConfig = (): Partial<HighchartsOptions> => ({
  ...getBaseChartConfig(),
  chart: {
    ...getBaseChartConfig().chart,
    type: 'column'
  },
  xAxis: {
    type: 'category',
    title: { text: null },
    ...getAxisConfig()
  },
  yAxis: {
    title: { text: null },
    ...getAxisConfig(),
    labels: {
      ...getAxisConfig().labels,
      formatter: function() {
        return this.value?.toLocaleString() || '';
      }
    }
  },
  plotOptions: {
    column: {
      borderRadius: 4
    }
  }
});

export const getPieChartConfig = (): Partial<HighchartsOptions> => ({
  ...getBaseChartConfig(),
  chart: {
    ...getBaseChartConfig().chart,
    type: 'pie'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f}%',
        style: {
          color: 'hsl(var(--foreground))'
        }
      }
    }
  }
});
