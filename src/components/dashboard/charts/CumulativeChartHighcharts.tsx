
import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod } from '@/utils/dataAggregation';

interface CumulativeChartHighchartsProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const CumulativeChartHighcharts = ({ data, aggregationPeriod }: CumulativeChartHighchartsProps) => {
  const chartData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    
    let cumulativeAskRequests = 0;
    let cumulativeTabsAccepted = 0;
    let cumulativeTotalRequests = 0;

    const processedData = sortedData.map(row => {
      const askRequests = parseInt(row['Ask Requests']) || 0;
      const tabsAccepted = parseInt(row['Tabs Accepted']) || 0;
      const editRequests = parseInt(row['Edit Requests']) || 0;
      const agentRequests = parseInt(row['Agent Requests']) || 0;
      const apiRequests = parseInt(row['API Requests']) || 0;
      const totalRequests = askRequests + editRequests + agentRequests + apiRequests;

      cumulativeAskRequests += askRequests;
      cumulativeTabsAccepted += tabsAccepted;
      cumulativeTotalRequests += totalRequests;

      return {
        date: new Date(row.Date).getTime(),
        askRequests: cumulativeAskRequests,
        tabsAccepted: cumulativeTabsAccepted,
        totalRequests: cumulativeTotalRequests,
      };
    });

    return processedData;
  }, [data]);

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
        text: 'Date'
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
        text: 'Cumulative Count',
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
        name: 'Ask Requests',
        type: 'line',
        data: chartData.map(d => [d.date, d.askRequests]),
        color: '#0088FE'
      },
      {
        name: 'Tabs Accepted',
        type: 'line',
        data: chartData.map(d => [d.date, d.tabsAccepted]),
        color: '#00C49F'
      },
      {
        name: 'Total Requests',
        type: 'line',
        data: chartData.map(d => [d.date, d.totalRequests]),
        color: '#FFBB28'
      }
    ],
    credits: {
      enabled: false
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Cumulative Usage Over Time (Highcharts Sample)
        </CardTitle>
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
