
import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';
import { type AggregationPeriod } from '@/utils/dataAggregation';

interface ChatRequestTypesChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const ChatRequestTypesChart = ({ data, aggregationPeriod }: ChatRequestTypesChartProps) => {
  const chartData = useMemo(() => {
    const periodData = new Map<string, {
      agent: number;
      cmdK: number;
      ask: number;
      edit: number;
      bugbot: number;
    }>();

    // Filter out aggregated rows and process individual user data
    const userRows = data.filter(row => !row.Email.includes('active users'));
    
    userRows.forEach(row => {
      const date = row.Date;
      
      if (!periodData.has(date)) {
        periodData.set(date, {
          agent: 0,
          cmdK: 0,
          ask: 0,
          edit: 0,
          bugbot: 0,
        });
      }
      
      const dayData = periodData.get(date)!;
      dayData.agent += parseInt(row['Agent Requests']) || 0;
      dayData.cmdK += parseInt(row['Cmd+K Requests']) || 0;
      dayData.ask += parseInt(row['Ask Requests']) || 0;
      dayData.edit += parseInt(row['Edit Requests']) || 0;
      dayData.bugbot += parseInt(row['Bugbot Requests']) || 0;
    });

    // Convert to chart series format
    const dates = Array.from(periodData.keys()).sort();
    
    return {
      dates: dates.map(date => new Date(date).getTime()),
      agent: dates.map(date => periodData.get(date)!.agent),
      cmdK: dates.map(date => periodData.get(date)!.cmdK),
      ask: dates.map(date => periodData.get(date)!.ask),
      edit: dates.map(date => periodData.get(date)!.edit),
      bugbot: dates.map(date => periodData.get(date)!.bugbot),
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
      type: 'column',
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
        text: 'Usage',
        style: {
          color: 'hsl(var(--foreground))'
        }
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
                ${this.series.name}: <b>${this.y}</b>`;
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderRadius: 2,
        pointPadding: 0.1,
        groupPadding: 0.15
      }
    },
    series: [
      {
        name: 'Agent',
        type: 'column',
        data: chartData.agent.map((value, index) => [chartData.dates[index], value]),
        color: '#F59E0B', // Yellow/Gold
      },
      {
        name: 'Cmd+K',
        type: 'column',
        data: chartData.cmdK.map((value, index) => [chartData.dates[index], value]),
        color: '#EC4899', // Pink
      },
      {
        name: 'Ask',
        type: 'column',
        data: chartData.ask.map((value, index) => [chartData.dates[index], value]),
        color: '#3B82F6', // Blue
      },
      {
        name: 'Edit',
        type: 'column',
        data: chartData.edit.map((value, index) => [chartData.dates[index], value]),
        color: '#10B981', // Green
      },
      {
        name: 'Bugbot',
        type: 'column',
        data: chartData.bugbot.map((value, index) => [chartData.dates[index], value]),
        color: '#8B5CF6', // Purple
      },
    ],
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
          <CardTitle className="text-xl font-semibold">Chat Request Types ({getPeriodText()})</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Breakdown of different chat request types over time.</p>
                <p className="text-sm text-muted-foreground mt-1">Shows Agent, Cmd+K, Ask, Edit, and Bugbot requests</p>
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

export default ChatRequestTypesChart;
