import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/treemap';
import { CursorDataRow } from '@/pages/Index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ProgrammingLanguageTreemapProps {
  data: CursorDataRow[];
}

const COLORS = [
  '#3B82F6', '#F59E42', '#10B981', '#F43F5E', '#6366F1', '#FBBF24', '#8B5CF6', '#EC4899', '#22D3EE', '#F87171',
  '#A3E635', '#F472B6', '#FCD34D', '#60A5FA', '#34D399', '#FCA5A5', '#818CF8', '#FDE68A', '#6EE7B7', '#F9A8D4'
];

export const ProgrammingLanguageTreemap = ({ data }: ProgrammingLanguageTreemapProps) => {
  const treemapData = useMemo(() => {
    const extensionCounts = new Map<string, number>();
    data.forEach(row => {
      const extension = row['Most Used Apply Extension'];
      if (extension && extension.trim() && extension !== 'Unknown') {
        const displayName = extension.toLowerCase() === 'tsx' ? 'TypeScript' : extension;
        extensionCounts.set(displayName, (extensionCounts.get(displayName) || 0) + 1);
      }
    });

    const totalCount = Array.from(extensionCounts.values()).reduce((sum, count) => sum + count, 0);

    return Array.from(extensionCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([extension, count], index) => ({
        name: extension,
        value: count,
        percentage: ((count / totalCount) * 100).toFixed(1),
        color: COLORS[index % COLORS.length]
      }));
  }, [data]);

  const options: Highcharts.Options = {
    chart: {
      type: 'treemap',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      marginBottom: 80,
    },
    title: {
      text: undefined
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      style: {
        color: '#ffffff'
      },
      pointFormat: '<b>{point.name}</b><br/>Usage: {point.percentage}%'
    },
    plotOptions: {
      treemap: {
        layoutAlgorithm: 'squarified',
        dataLabels: {
          enabled: true,
          format: '{point.name}<br/>{point.percentage}%',
          style: {
            color: '#ffffff',
            textOutline: '1px contrast',
            fontWeight: 'bold'
          }
        }
      }
    },
    series: [{
      type: 'treemap',
      data: treemapData,
      name: 'Programming Languages'
    }],
    legend: {
      enabled: false
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Programming Language Usage</CardTitle>
            <CardDescription>Visual representation of the most frequently used programming languages</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground hover:scale-110 transition-all cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
              <p>Shows programming languages by usage frequency. Larger rectangles indicate more frequent use.</p>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {treemapData.length > 0 ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No programming language data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
