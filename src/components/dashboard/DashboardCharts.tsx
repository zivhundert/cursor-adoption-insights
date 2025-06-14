
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

export const DashboardCharts = ({ data, originalData, baseFilteredData, aggregationPeriod, selectedUsers }: DashboardChartsProps) => {
  const { settings } = useSettings();
  const { chartVisibility } = settings;
  const isFiltered = selectedUsers && selectedUsers.length > 0;

  const modelAndChatChartsVisible = chartVisibility.modelUsageChart || chartVisibility.chatRequestTypesChart;
  const averageChartsVisible = chartVisibility.averageAskRequestsChart || chartVisibility.averageTabsAcceptedChart;
  const visualizationChartsVisible = chartVisibility.tabExtensionWordCloud || chartVisibility.programmingLanguageTreemap;
  const dayOfWeekAndClientChartsVisible = (chartVisibility.dayOfWeekChart && aggregationPeriod === 'day') || chartVisibility.clientVersionChart;

  return (
    <div className="space-y-8">
      {/* Main cumulative chart */}
      {chartVisibility.cumulativeChart && (
        <CumulativeChart baseFilteredData={baseFilteredData} aggregationPeriod={aggregationPeriod} />
      )}
      
      {/* Acceptance Rate chart */}
      {chartVisibility.acceptanceRateChart && (
        <AcceptanceRateChart data={data} aggregationPeriod={aggregationPeriod} />
      )}
      
      {/* Second row - Model Usage and Chat Request Types charts */}
      {modelAndChatChartsVisible && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartVisibility.modelUsageChart && (
            <ModelUsageChart data={data} />
          )}
          {chartVisibility.chatRequestTypesChart && (
            <ChatRequestTypesChart data={data} aggregationPeriod={aggregationPeriod} />
          )}
        </div>
      )}
      
      {/* Third row - Average charts */}
      {averageChartsVisible && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartVisibility.averageAskRequestsChart && (
            <AverageAskRequestsChart data={data} aggregationPeriod={aggregationPeriod} />
          )}
          {chartVisibility.averageTabsAcceptedChart && (
            <AverageTabsAcceptedChart data={data} aggregationPeriod={aggregationPeriod} />
          )}
        </div>
      )}

      {/* Fourth row - Treemap and Word Cloud visualizations */}
      {visualizationChartsVisible && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartVisibility.tabExtensionWordCloud && (
            <TabExtensionWordCloud data={data} />
          )}
          {chartVisibility.programmingLanguageTreemap && (
            <ProgrammingLanguageTreemap data={data} />
          )}
        </div>
      )}
      
      {/* Fifth row - Day of Week Chart and Client Version Chart */}
      {dayOfWeekAndClientChartsVisible && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartVisibility.dayOfWeekChart && aggregationPeriod === 'day' && (
            <DayOfWeekChart data={data} />
          )}
          {chartVisibility.clientVersionChart && (
            <div className={chartVisibility.dayOfWeekChart && aggregationPeriod === 'day' ? "lg:col-span-1" : "lg:col-span-2"}>
              <ClientVersionChart data={data} aggregationPeriod={aggregationPeriod} />
            </div>
          )}
        </div>
      )}

      {/* Sixth row - AI Adoption Champions Table (full width) */}
      {chartVisibility.topContributorsTable && (
        <div className="grid grid-cols-1">
          <TopContributorsTable data={data} isFiltered={isFiltered} />
        </div>
      )}
    </div>
  );
};
