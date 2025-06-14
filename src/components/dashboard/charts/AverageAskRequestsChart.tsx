
import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { formatPeriodLabel, type AggregationPeriod } from '@/utils/dataAggregation';

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
      period.userDays += 1;
    });

    const sortedData = Array.from(periodData.entries())
      .map(([date, { total, userDays }]) => ({
        date: new Date(date).getTime(),
        total,
        average: userDays > 0 ? Math.round((total / userDays) * 10) / 10 : 0
      }))
      .sort((a, b) => a.date - b.date);

    // Calculate 7-period moving averages
    const movingAvgPeriod = Math.min(7, Math.max(3, Math.floor(sortedData.length / 10)));
    const totalMovingAvg = sortedData.map((item, index) => {
      const start = Math.max(0, index - movingAvgPeriod + 1);
      const slice = sortedData.slice(start, index + 1);
      const avg = slice.reduce((sum, d) => sum + d.total, 0) / slice.length;
      return [item.date, Math.round(avg * 10) / 10];
    });

    const avgMovingAvg = sortedData.map((item, index) => {
      const start = Math.max(0, index - movingAvgPeriod + 1);
      const slice = sortedData.slice(start, index + 1);
      const avg = slice.reduce((sum, d) => sum + d.average, 0) / slice.length;
      return [item.date, Math.round(avg * 10) / 10];
    });

    return {
      total: sortedData.map(d => [d.date, d.total]),
      average: sortedData.map(d => [d.date, d.average]),
      totalMovingAvg,
      avgMovingAvg
    };
  }, [data]);

  const getPeriodText = () => {
    switch (aggregationPeriod) {
      case 'week': return 'weekly';
      case 'month': return 'monthly';
      default: return 'daily';
    }
  };

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      marginBottom: 100,
    },
    title: {
      text: undefined
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: null
      },
      gridLineColor: 'hsl(var(--border))',
      lineColor: 'hsl(var(--border))',
      tickColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--foreground))'
        }
      }
    },
    yAxis: [{
      title: {
        text: 'Total Ask Requests',
        style: {
          color: '#16a34a'
        }
      },
      gridLineColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--foreground))'
        }
      }
    }, {
      title: {
        text: 'Average per User',
        style: {
          color: '#059669'
        }
      },
      opposite: true,
      labels: {
        style: {
          color: 'hsl(var(--foreground))'
        }
      }
    }],
    tooltip: {
      backgroundColor: 'hsl(var(--background))',
      borderColor: 'hsl(var(--border))',
      style: {
        color: 'hsl(var(--foreground))'
      },
      shared: true,
      formatter: function() {
        let tooltip = `<b>${Highcharts.dateFormat('%Y-%m-%d', this.x as number)}</b><br/>`;
        this.points?.forEach(point => {
          tooltip += `<span style="color:${point.color}">${point.series.name}: <b>${point.y}</b></span><br/>`;
        });
        return tooltip;
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4
        },
        lineWidth: 2
      }
    },
    series: [{
      name: 'Total Ask Requests',
      type: 'line',
      data: chartData.total,
      color: '#16a34a',
      yAxis: 0
    }, {
      name: 'Average per User',
      type: 'line',
      data: chartData.average,
      color: '#059669',
      yAxis: 1,
      dashStyle: 'Dash'
    }, {
      name: 'Total Trend',
      type: 'line',
      data: chartData.totalMovingAvg,
      color: '#16a34a',
      opacity: 0.6,
      yAxis: 0,
      marker: {
        enabled: false
      },
      dashStyle: 'Dot'
    }, {
      name: 'Average Trend',
      type: 'line',
      data: chartData.avgMovingAvg,
      color: '#059669',
      opacity: 0.6,
      yAxis: 1,
      marker: {
        enabled: false
      },
      dashStyle: 'Dot'
    }],
    credits: {
      enabled: false
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
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">AI Chat Usage Trends ({getPeriodText()})</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows Ask Requests trends over time with total usage and per-user averages.</p>
                <p className="text-sm text-muted-foreground mt-1">Dotted lines show moving average trends for pattern identification</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[420px]">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </div>
      </CardContent>
    </Card>
  );
};
