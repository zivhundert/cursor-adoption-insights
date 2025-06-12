
import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';

interface DayOfWeekChartProps {
  data: CursorDataRow[];
}

export const DayOfWeekChart = ({ data }: DayOfWeekChartProps) => {
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
      type: 'category',
      title: {
        text: 'Day of Week',
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
        text: 'Accepted Lines',
        style: {
          color: 'hsl(var(--muted-foreground))'
        }
      },
      gridLineColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--muted-foreground))'
        },
        formatter: function() {
          return this.value?.toLocaleString() || '';
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
        return `${this.x}<br/>
                Accepted Lines: <b>${this.y?.toLocaleString()}</b>`;
      }
    },
    plotOptions: {
      column: {
        color: '#0891b2',
        borderRadius: 4
      }
    },
    series: [{
      name: 'Accepted Lines',
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
          <CardTitle className="text-xl font-semibold">Activity by Day of Week</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Total accepted lines grouped by day of the week.</p>
                <p className="text-sm text-muted-foreground mt-1">Shows which days have the highest coding activity</p>
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
