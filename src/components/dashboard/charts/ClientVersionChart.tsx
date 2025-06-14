
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod, formatPeriodLabel } from '@/utils/dataAggregation';

interface ClientVersionChartProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const ClientVersionChart = ({ data, aggregationPeriod }: ClientVersionChartProps) => {
  const chartData = useMemo(() => {
    // Filter out aggregated summary rows
    const userRows = data.filter(row => !row.Email.includes('active users'));
    
    // Group data by date and count versions
    const dateVersionMap = new Map<string, Map<string, number>>();
    const allVersions = new Set<string>();
    
    userRows.forEach(row => {
      const date = row.Date;
      const version = row['Client Version'];
      
      if (!version || version.trim() === '') return;
      
      allVersions.add(version);
      
      if (!dateVersionMap.has(date)) {
        dateVersionMap.set(date, new Map());
      }
      
      const versionMap = dateVersionMap.get(date)!;
      versionMap.set(version, (versionMap.get(version) || 0) + 1);
    });
    
    // Sort dates
    const sortedDates = Array.from(dateVersionMap.keys()).sort();
    
    // Sort versions (newer versions typically have higher numbers)
    const sortedVersions = Array.from(allVersions).sort((a, b) => {
      // Extract version numbers for proper sorting
      const aMatch = a.match(/(\d+(?:\.\d+)*)/);
      const bMatch = b.match(/(\d+(?:\.\d+)*)/);
      
      if (aMatch && bMatch) {
        const aParts = aMatch[1].split('.').map(Number);
        const bParts = bMatch[1].split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aPart = aParts[i] || 0;
          const bPart = bParts[i] || 0;
          if (aPart !== bPart) return aPart - bPart;
        }
      }
      
      return a.localeCompare(b);
    });
    
    // Calculate percentages for each date
    const categories = sortedDates.map(date => formatPeriodLabel(date, aggregationPeriod));
    
    const series = sortedVersions.map((version, index) => {
      const versionData = sortedDates.map(date => {
        const versionMap = dateVersionMap.get(date)!;
        const versionCount = versionMap.get(version) || 0;
        const totalCount = Array.from(versionMap.values()).reduce((sum, count) => sum + count, 0);
        
        return totalCount > 0 ? (versionCount / totalCount) * 100 : 0;
      });
      
      // Color scheme: older versions (gold/amber), middle (blue), newer (green)
      const colorIndex = index / (sortedVersions.length - 1);
      let color: string;
      
      if (colorIndex < 0.33) {
        color = '#F59E0B'; // Amber for older versions
      } else if (colorIndex < 0.67) {
        color = '#3B82F6'; // Blue for middle versions
      } else {
        color = '#10B981'; // Green for newer versions
      }
      
      return {
        name: version,
        type: 'column' as const,
        data: versionData,
        color: color,
        stack: 'versions'
      };
    });
    
    return { categories, series };
  }, [data, aggregationPeriod]);
  
  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: 400,
      backgroundColor: 'transparent'
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: chartData.categories,
      title: {
        text: 'Time Period'
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Percentage (%)'
      },
      stackLabels: {
        enabled: false
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        fontSize: '12px'
      }
    },
    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.1f}%</b><br/>',
      shared: true
    },
    plotOptions: {
      column: {
        stacking: 'percent',
        dataLabels: {
          enabled: false
        },
        borderWidth: 0
      }
    },
    series: chartData.series,
    credits: {
      enabled: false
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">Client Version Distribution</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribution of Cursor client versions used over time.</p>
                <p className="text-sm text-muted-foreground mt-1">Shows percentage adoption of different client versions.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </CardContent>
    </Card>
  );
};
