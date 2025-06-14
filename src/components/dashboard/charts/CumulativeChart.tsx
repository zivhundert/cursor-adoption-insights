import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
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
    yAxis: {
      title: {
        text: null
      },
      gridLineColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--foreground))'
        },
        formatter: function() {
          return this.value?.toLocaleString() || '';
        }
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
          <CardTitle className="text-xl font-semibold">AI Code Generation Growth ({getPeriodText()})</CardTitle>
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
