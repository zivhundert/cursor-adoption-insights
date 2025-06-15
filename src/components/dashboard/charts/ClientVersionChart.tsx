import { useMemo } from 'react';
import { Options as HighchartsOptions } from 'highcharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { BaseHighchart } from '@/components/common/BaseHighchart';
import { getColumnChartConfig, CHART_COLORS } from '@/config/chartConfigs';
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
    
    const dateVersionMap = new Map<string, Map<string, { count: number, users: string[] }>>();
    const allVersions = new Set<string>();
    
    userRows.forEach(row => {
      const date = row.Date;
      const version = row['Client Version'];
      const userEmail = row.Email;
      
      if (!version || version.trim() === '') return;
      
      allVersions.add(version);
      
      if (!dateVersionMap.has(date)) {
        dateVersionMap.set(date, new Map());
      }
      
      const versionMap = dateVersionMap.get(date)!;
      if (!versionMap.has(version)) {
        versionMap.set(version, { count: 0, users: [] });
      }
      
      const versionData = versionMap.get(version)!;
      versionData.count += 1;
      if (!versionData.users.includes(userEmail)) {
        versionData.users.push(userEmail);
      }
    });
    
    const sortedDates = Array.from(dateVersionMap.keys()).sort();
    
    const sortedVersions = Array.from(allVersions).sort((a, b) => {
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
    
    const categories = sortedDates.map(date => formatPeriodLabel(date, aggregationPeriod));
    
    const series = sortedVersions.map((version, index) => {
      const versionData = sortedDates.map(date => {
        const versionMap = dateVersionMap.get(date)!;
        const versionInfo = versionMap.get(version) || { count: 0, users: [] };
        const totalCount = Array.from(versionMap.values()).reduce((sum, info) => sum + info.count, 0);
        
        const percentage = totalCount > 0 ? (versionInfo.count / totalCount) * 100 : 0;
        
        return {
          y: percentage,
          users: versionInfo.users,
          count: versionInfo.count,
          version: version
        };
      });
      
      const colorIndex = index / (sortedVersions.length - 1);
      let color: string;
      
      if (colorIndex < 0.33) {
        color = CHART_COLORS.secondary[0];
      } else if (colorIndex < 0.67) {
        color = CHART_COLORS.secondary[2];
      } else {
        color = CHART_COLORS.secondary[3];
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
  
  const options: Partial<HighchartsOptions> = {
    ...getColumnChartConfig(),
    chart: {
      ...getColumnChartConfig().chart,
      marginBottom: 150,
    },
    xAxis: {
      type: 'category',
      categories: chartData.categories,
      labels: {
        rotation: -45,
        style: {
          fontSize: '11px',
          color: 'hsl(var(--foreground))'
        }
      },
      gridLineColor: 'hsl(var(--border))',
      lineColor: 'hsl(var(--border))',
      tickColor: 'hsl(var(--border))'
    },
    yAxis: {
      ...getColumnChartConfig().yAxis,
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
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      y: -20,
      maxHeight: 60,
      navigation: {
        enabled: true
      },
      itemStyle: {
        fontSize: '11px',
        color: 'hsl(var(--foreground))'
      }
    },
    tooltip: {
      backgroundColor: 'hsl(var(--background))',
      borderColor: 'hsl(var(--border))',
      style: {
        color: 'hsl(var(--foreground))'
      },
      shared: false,
      useHTML: true,
      formatter: function() {
        const point = this as any;
        const series = this.series as any;
        const users = point.users || [];
        const version = point.version || series.name;
        const percentage = point.y || 0;
        const count = point.count || 0;
        
        let usersList = '';
        if (users.length > 0) {
          const displayUsers = users.slice(0, 10);
          const remainingCount = users.length - displayUsers.length;
          
          usersList = displayUsers.join('<br/>');
          if (remainingCount > 0) {
            usersList += `<br/><i>... and ${remainingCount} more user${remainingCount > 1 ? 's' : ''}</i>`;
          }
        }
        
        return `
          <div style="padding: 8px; min-width: 200px;">
            <strong style="color: ${series.color};">${version}</strong><br/>
            <span style="font-size: 12px; color: hsl(var(--muted-foreground));">
              ${percentage.toFixed(1)}% (${count} user${count !== 1 ? 's' : ''})
            </span>
            ${usersList ? `<br/><br/><strong>Users:</strong><br/><span style="font-size: 11px;">${usersList}</span>` : ''}
          </div>
        `;
      }
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
    series: chartData.series
  };
  
  return (
    <ChartContainer
      title="Client Version Distribution"
      helpText="Distribution of Cursor client versions used over time. Hover over bars to see which users are using each version."
    >
      <BaseHighchart options={options} />
    </ChartContainer>
  );
};
