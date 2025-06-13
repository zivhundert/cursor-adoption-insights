
import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
require('highcharts/modules/treemap')(Highcharts);
import { CursorDataRow } from '@/pages/Index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProgrammingLanguageTreemapProps {
  data: CursorDataRow[];
}

export const ProgrammingLanguageTreemap = ({ data }: ProgrammingLanguageTreemapProps) => {
  const treemapData = useMemo(() => {
    const extensionCounts = new Map<string, number>();
    
    data.forEach(row => {
      const extension = row['Most Used Apply Extension'];
      if (extension && extension.trim() && extension !== 'Unknown' && extension !== '') {
        extensionCounts.set(extension, (extensionCounts.get(extension) || 0) + 1);
      }
    });

    return Array.from(extensionCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'treemap',
      backgroundColor: 'transparent',
      height: 400,
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: '<b>{point.name}</b>: {point.value} uses',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ccc',
      borderRadius: 8,
      shadow: true,
    },
    plotOptions: {
      treemap: {
        layoutAlgorithm: 'squarified',
        allowDrillToNode: true,
        animation: true,
        borderColor: '#ffffff',
        borderWidth: 2,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            color: '#ffffff',
            fontWeight: 'bold',
            textOutline: '1px contrast',
          },
        },
        levels: [{
          level: 1,
          dataLabels: {
            enabled: true,
          },
        }],
      },
    },
    colorAxis: {
      minColor: '#3B82F6',
      maxColor: '#1E40AF',
    },
    series: [{
      type: 'treemap',
      data: treemapData,
      name: 'Programming Languages',
    }],
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  }), [treemapData]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Programming Language Usage</CardTitle>
            <CardDescription>Visual representation of the most frequently used programming languages</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows programming languages by usage frequency. Larger rectangles indicate more frequent use.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {treemapData.length > 0 ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
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
