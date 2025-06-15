import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

  const options: Highcharts.Options = {
    chart: {
      type: 'line', // CHANGED FROM 'column' TO 'line'
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
    yAxis: {
      title: {
        text: null
      },
      gridLineColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--foreground))'
        }
      }
    },
    tooltip: {
      backgroundColor: 'hsl(var(--background))',
      borderColor: 'hsl(var(--border))',
      style: {
        color: 'hsl(var(--foreground))'
      },
      formatter: function() {
        return `Date: ${Highcharts.dateFormat('%Y-%m-%d', this.x as number)}<br/>
                Average Ask Requests: <b>${this.y}</b>`;
      }
    },
    plotOptions: {
      line: {
        color: '#16a34a',
        marker: { enabled: true },
      }
    },
    series: [{
      name: 'Average Ask Requests',
      type: 'line',
      data: chartData
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
          <CardTitle className="text-xl font-semibold">AI Chat Usage per Developer ({getPeriodText()})</CardTitle>
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground hover:scale-110 transition-all cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
              <p>Shows the average Ask Requests per user per {getPeriodText().slice(0, -2)} period.</p>
              <p className="text-sm text-muted-foreground mt-1">Calculated as Total Ask Requests ÷ Number of User-Days in period</p>
            </PopoverContent>
          </Popover>
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
