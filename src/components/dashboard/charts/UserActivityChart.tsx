
import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { formatPeriodLabel, type AggregationPeriod } from '@/utils/dataAggregation';

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

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: undefined
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date',
        style: {
          color: 'hsl(var(--muted-foreground))'
        }
      },
      gridLineColor: 'hsl(var(--border))',
      lineColor: 'hsl(var(--border))',
      tickColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--muted-foreground))'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Active Users',
        style: {
          color: 'hsl(var(--muted-foreground))'
        }
      },
      gridLineColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--muted-foreground))'
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
                Active Users: <b>${this.y}</b>`;
      }
    },
    plotOptions: {
      column: {
        color: '#8884d8',
        borderRadius: 4
      }
    },
    series: [{
      name: 'Active Users',
      type: 'column',
      data: chartData
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">Active Users ({getPeriodText()})</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of active users per {aggregationPeriod}.</p>
                <p className="text-sm text-muted-foreground mt-1">Counts users where 'Is Active' field is true</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
