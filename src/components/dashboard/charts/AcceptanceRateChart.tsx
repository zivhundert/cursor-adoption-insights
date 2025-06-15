import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod } from '@/utils/dataAggregation';

interface AcceptanceRateChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const AcceptanceRateChart = ({ data, aggregationPeriod }: AcceptanceRateChartProps) => {
  const chartData = useMemo(() => {
    const periodData = new Map<string, { accepted: number; suggested: number }>();
    
    data.forEach(row => {
      const date = row.Date;
      const accepted = parseInt(row['Chat Accepted Lines Added']) || 0;
      const suggested = parseInt(row['Chat Suggested Lines Added']) || 0;
      
      if (!periodData.has(date)) {
        periodData.set(date, { accepted: 0, suggested: 0 });
      }
      
      const period = periodData.get(date)!;
      period.accepted += accepted;
      period.suggested += suggested;
    });

    return Array.from(periodData.entries())
      .map(([date, { accepted, suggested }]) => {
        const timestamp = new Date(date).getTime();
        const rate = suggested > 0 ? (accepted / suggested) * 100 : 0;
        return [timestamp, rate];
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
      min: 0,
      max: 100,
      gridLineColor: 'hsl(var(--border))',
      labels: {
        style: {
          color: 'hsl(var(--foreground))'
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
        return `Date: ${Highcharts.dateFormat('%Y-%m-%d', this.x as number)}<br/>
                Acceptance Rate: <b>${(this.y as number).toFixed(1)}%</b>`;
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
    plotOptions: {
      line: {
        lineWidth: 3,
        marker: {
          enabled: true,
          radius: 4,
          states: {
            hover: {
              enabled: true,
              radius: 6
            }
          }
        }
      }
    },
    series: [
      {
        name: 'Acceptance Rate',
        type: 'line',
        data: chartData,
        color: '#10b981',
        marker: {
          fillColor: '#10b981',
          lineColor: '#059669',
          lineWidth: 2
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
            AI Adoption Quality Trend ({getPeriodText()})
          </CardTitle>
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground hover:scale-110 transition-all cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
              <p>Shows the percentage of suggested lines that were accepted over time.</p>
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
