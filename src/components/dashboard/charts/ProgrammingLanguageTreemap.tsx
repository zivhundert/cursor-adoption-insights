
import { useMemo } from 'react';
import Highcharts from 'highcharts';
import 'highcharts/modules/treemap';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getTreemapChartConfig, CHART_COLORS } from '@/config/chartConfigs';
import { CursorDataRow } from '@/pages/Index';

interface ProgrammingLanguageTreemapProps {
  data: CursorDataRow[];
}

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
        color: CHART_COLORS.treemap[index % CHART_COLORS.treemap.length]
      }));
  }, [data]);

  const options: Partial<HighchartsOptions> = {
    ...getTreemapChartConfig(),
    series: [{
      type: 'treemap',
      data: treemapData,
      name: 'Programming Languages'
    }]
  };

  const isEmpty = treemapData.length === 0;

  return (
    <ChartContainer
      title="Programming Language Usage"
      helpText="Visual representation of the most frequently used programming languages. Shows programming languages by usage frequency. Larger rectangles indicate more frequent use."
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No programming language data available
        </div>
      ) : (
        <BaseHighchart options={options} />
      )}
    </ChartContainer>
  );
};
