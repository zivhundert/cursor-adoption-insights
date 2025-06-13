import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod } from '@/utils/dataAggregation';

// Initialize the highcharts-more module (includes arearange)
HighchartsMore(Highcharts);

interface AcceptanceRateChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const AcceptanceRateChart = ({ data, aggregationPeriod }: AcceptanceRateChartProps) => {
  const chartData = useMemo(() => {
    const periodData = new Map<string, { accepted: number; suggested: number; rates: number[] }>();
    
    data.forEach(row => {
      const date = row.Date;
      const accepted = parseInt(row['Chat Accepted Lines Added']) || 0;
      const suggested = parseInt(row['Chat Suggested Lines Added']) || 0;
      
      if (!periodData.has(date)) {
        periodData.set(date, { accepted: 0, suggested: 0, rates: [] });
      }
      
      const period = periodData.get(date)!;
      period.accepted += accepted;
      period.suggested += suggested;
      
      // Calculate individual user acceptance rate for range calculation
      if (suggested > 0) {
        const userRate = (accepted / suggested) * 100;
        period.rates.push(userRate);
      }
    });

    return Array.from(periodData.entries())
      .map(([date, { accepted, suggested, rates }]) => {
        const timestamp = new Date(date).getTime();
        const overallRate = suggested > 0 ? (accepted / suggested) * 100 : 0;
        
        let low = overallRate;
        let high = overallRate;
        
        // Calculate range based on individual user rates
        if (rates.length > 1) {
          rates.sort((a, b) => a - b);
          low = Math.min(rates[0], overallRate);
          high = Math.max(rates[rates.length - 1], overallRate);
        }
        
        return [timestamp, low, high, overallRate];
      })
      .sort((a, b) => a[0] - b[0]);
  }, [data]);

  const getPeriodText = () => {
    switch (aggregationPeriod) {
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      default: return 'Daily';
    }
  };

  const options: Highcharts.Options = {
    chart: {
      type: 'arearange',
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
        text: 'Acceptance Rate (%)',
        style: {
          color: 'hsl(var(--muted-foreground))'
        }
      },
      min: 0,
      max: 100,
      gridLineColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--muted-foreground))'
        },
        formatter: function() {
          return this.value + '%';
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
        const point = this.points ? this.points[0] : this;
        const pointData = point.options as any;
        return `Date: ${Highcharts.dateFormat('%Y-%m-%d', this.x as number)}<br/>
                Range: <b>${pointData.low?.toFixed(1)}% - ${pointData.high?.toFixed(1)}%</b><br/>
                Average: <b>${pointData.overallRate?.toFixed(1)}%</b>`;
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      arearange: {
        fillOpacity: 0.3,
        lineWidth: 0,
        color: '#10b981',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(16, 185, 129, 0.3)'],
            [1, 'rgba(16, 185, 129, 0.1)']
          ]
        }
      }
    },
    series: [
      {
        name: 'Acceptance Rate Range',
        type: 'arearange',
        data: chartData.map(d => ({
          x: d[0],
          low: d[1],
          high: d[2],
          overallRate: d[3]
        }))
      },
      {
        name: 'Average Acceptance Rate',
        type: 'line',
        data: chartData.map(d => [d[0], d[3]]),
        color: '#059669',
        lineWidth: 2,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        }
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
          <CardTitle className="text-xl font-semibold">
            Acceptance Rate Over Time ({getPeriodText()})
          </CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows the percentage of suggested lines that were accepted over time.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Shaded area represents the range of acceptance rates across users, 
                  while the line shows the overall average.
                </p>
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
