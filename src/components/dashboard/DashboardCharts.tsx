
import React, { useMemo } from 'react';
import { CumulativeChart } from './charts/CumulativeChart';
import { AcceptanceRateChart } from './charts/AcceptanceRateChart';
import { AverageAskRequestsChart } from './charts/AverageAskRequestsChart';
import { AverageTabsAcceptedChart } from './charts/AverageTabsAcceptedChart';
import { ModelUsageChart } from './charts/ModelUsageChart';
import { TopContributorsTable } from './charts/TopContributorsTable/TopContributorsTable';
import { ChatRequestTypesChart } from './charts/ChatRequestTypesChart';
import { DayOfWeekChart } from './charts/DayOfWeekChart';
import { ProgrammingLanguageTreemap } from './charts/ProgrammingLanguageTreemap';
import { TabExtensionWordCloud } from './charts/TabExtensionWordCloud';
import { ClientVersionChart } from './charts/ClientVersionChart';
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod } from '@/utils/dataAggregation';
import { useSettings } from '@/contexts/SettingsContext';

interface DashboardChartsProps {
  data: CursorDataRow[];
  originalData: CursorDataRow[];
  baseFilteredData: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
  selectedUsers?: string[];
}

interface ChartRowConfig {
  key: string;
  charts: Array<{
    component: React.ReactNode;
    visible: boolean;
    colSpan?: 'full' | 'half';
  }>;
}

export const DashboardCharts = React.memo(({ 
  data, 
  originalData, 
  baseFilteredData, 
  aggregationPeriod, 
  selectedUsers 
}: DashboardChartsProps) => {
  const { settings } = useSettings();
  const { chartVisibility } = settings;
  const isFiltered = selectedUsers && selectedUsers.length > 0;

  // Memoize chart configurations to prevent unnecessary re-renders
  const chartRows = useMemo((): ChartRowConfig[] => [
    {
      key: 'main-charts',
      charts: [
        {
          component: <CumulativeChart baseFilteredData={baseFilteredData} aggregationPeriod={aggregationPeriod} />,
          visible: chartVisibility.cumulativeChart,
          colSpan: 'full'
        },
        {
          component: <AcceptanceRateChart data={data} aggregationPeriod={aggregationPeriod} />,
          visible: chartVisibility.acceptanceRateChart,
          colSpan: 'full'
        }
      ]
    },
    {
      key: 'model-and-chat',
      charts: [
        {
          component: <ModelUsageChart data={data} />,
          visible: chartVisibility.modelUsageChart,
          colSpan: 'half'
        },
        {
          component: <ChatRequestTypesChart data={data} aggregationPeriod={aggregationPeriod} />,
          visible: chartVisibility.chatRequestTypesChart,
          colSpan: 'half'
        }
      ]
    },
    {
      key: 'average-charts',
      charts: [
        {
          component: <AverageAskRequestsChart data={data} aggregationPeriod={aggregationPeriod} />,
          visible: chartVisibility.averageAskRequestsChart,
          colSpan: 'half'
        },
        {
          component: <AverageTabsAcceptedChart data={data} aggregationPeriod={aggregationPeriod} />,
          visible: chartVisibility.averageTabsAcceptedChart,
          colSpan: 'half'
        }
      ]
    },
    {
      key: 'visualization-charts',
      charts: [
        {
          component: <TabExtensionWordCloud data={data} />,
          visible: chartVisibility.tabExtensionWordCloud,
          colSpan: 'half'
        },
        {
          component: <ProgrammingLanguageTreemap data={data} />,
          visible: chartVisibility.programmingLanguageTreemap,
          colSpan: 'half'
        }
      ]
    },
    {
      key: 'temporal-and-version',
      charts: [
        {
          component: <DayOfWeekChart data={data} />,
          visible: chartVisibility.dayOfWeekChart && aggregationPeriod === 'day',
          colSpan: 'half'
        },
        {
          component: <ClientVersionChart data={data} aggregationPeriod={aggregationPeriod} />,
          visible: chartVisibility.clientVersionChart,
          colSpan: 'half'
        }
      ]
    },
    {
      key: 'contributors-table',
      charts: [
        {
          component: <TopContributorsTable data={data} isFiltered={isFiltered} />,
          visible: chartVisibility.topContributorsTable,
          colSpan: 'full'
        }
      ]
    }
  ], [
    data, 
    originalData, 
    baseFilteredData, 
    aggregationPeriod, 
    selectedUsers, 
    isFiltered, 
    chartVisibility
  ]);

  // Helper function to render chart rows
  const renderChartRow = (rowConfig: ChartRowConfig) => {
    const visibleCharts = rowConfig.charts.filter(chart => chart.visible);
    
    if (visibleCharts.length === 0) return null;

    // Handle special case for temporal-and-version row where client version should span full width if day chart is hidden
    if (rowConfig.key === 'temporal-and-version') {
      const dayChartVisible = chartVisibility.dayOfWeekChart && aggregationPeriod === 'day';
      const clientVersionVisible = chartVisibility.clientVersionChart;
      
      if (clientVersionVisible && !dayChartVisible) {
        return (
          <div key={rowConfig.key} className="grid grid-cols-1">
            <ClientVersionChart data={data} aggregationPeriod={aggregationPeriod} />
          </div>
        );
      }
    }

    const gridClass = visibleCharts.some(chart => chart.colSpan === 'full') 
      ? "grid grid-cols-1" 
      : "grid grid-cols-1 lg:grid-cols-2 gap-8";

    return (
      <div key={rowConfig.key} className={gridClass}>
        {visibleCharts.map((chart, index) => (
          <div key={index} className={chart.colSpan === 'full' ? 'lg:col-span-2' : ''}>
            {chart.component}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {chartRows.map(renderChartRow)}
    </div>
  );
});

DashboardCharts.displayName = 'DashboardCharts';
