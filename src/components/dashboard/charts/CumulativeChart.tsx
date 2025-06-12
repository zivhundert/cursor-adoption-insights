
import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { formatPeriodLabel, type AggregationPeriod } from '@/utils/dataAggregation';

interface CumulativeChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const CumulativeChart = ({ data, aggregationPeriod }: CumulativeChartProps) => {
  const chartData = useMemo(() => {
    const dailyAccepted = new Map<string, number>();
    const dailySuggested = new Map<string, number>();
    
    data.forEach(row => {
      const date = row.Date;
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      const suggestedLines = parseInt(row['Chat Suggested Lines Added']) || 0;
      
      dailyAccepted.set(date, (dailyAccepted.get(date) || 0) + acceptedLines);
      dailySuggested.set(date, (dailySuggested.get(date) || 0) + suggestedLines);
    });

    const sortedDates = Array.from(new Set([...dailyAccepted.keys(), ...dailySuggested.keys()])).sort();
    let cumulativeAccepted = 0;
    let cumulativeSuggested = 0;
    
    return sortedDates.map(date => {
      cumulativeAccepted += dailyAccepted.get(date) || 0;
      cumulativeSuggested += dailySuggested.get(date) || 0;
      
      return {
        date: new Date(date).getTime(),
        cumulativeAccepted,
        cumulativeSuggested,
        dailyAccepted: dailyAccepted.get(date) || 0,
        dailySuggested: dailySuggested.get(date) || 0,
      };
    });
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
        text: 'Cumulative Lines',
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
    legend: {
      itemStyle: {
        color: 'hsl(var(--foreground))'
      }
    },
    tooltip: {
      backgroundColor: 'hsl(var(--background))',
      borderColor: 'hsl(var(--border))',
      style: {
        color: 'hsl(var(--foreground))'
      },
      formatter: function() {
        return `<b>${this.series.name}</b><br/>
                Date: ${Highcharts.dateFormat('%Y-%m-%d', this.x as number)}<br/>
                Value: ${this.y?.toLocaleString()}`;
      }
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
        color: '#0891b2'
      },
      {
        name: 'Cumulative Suggested',
        type: 'line',
        data: chartData.map(d => [d.date, d.cumulativeSuggested]),
        color: '#ea580c',
        dashStyle: 'Dash'
      }
    ],
    credits: {
      enabled: false
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">Cumulative Accepted Lines ({getPeriodText()})</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows the running total of accepted and suggested lines over time aggregated by {getPeriodText()} periods.</p>
                <p className="text-sm text-muted-foreground mt-1">Solid line: Cumulative 'Chat Accepted Lines Added'</p>
                <p className="text-sm text-muted-foreground">Dashed line: Cumulative 'Chat Suggested Lines Added'</p>
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
