import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface ModelUsageChartProps {
  data: CursorDataRow[];
}

export const ModelUsageChart = ({ data }: ModelUsageChartProps) => {
  const chartData = useMemo(() => {
    const modelCounts = new Map<string, number>();
    
    data.forEach(row => {
      const model = row['Most Used Model'] || 'No Model';
      modelCounts.set(model, (modelCounts.get(model) || 0) + 1);
    });

    return Array.from(modelCounts.entries())
      .map(([name, y], index) => ({ 
        name, 
        y, 
        color: COLORS[index % COLORS.length] 
      }))
      .sort((a, b) => b.y - a.y);
  }, [data]);

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: undefined
    },
    tooltip: {
      backgroundColor: 'hsl(var(--background))',
      borderColor: 'hsl(var(--border))',
      style: {
        color: 'hsl(var(--foreground))'
      },
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: 'hsl(var(--foreground))'
          }
        }
      }
    },
    series: [{
      name: 'Model Usage',
      type: 'pie',
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
          <CardTitle className="text-xl font-semibold">Model Usage Distribution</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribution of AI models used by all users.</p>
                <p className="text-sm text-muted-foreground mt-1">Based on 'Most Used Model' field per user session</p>
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
