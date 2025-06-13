
import { CumulativeChart } from './charts/CumulativeChart';
import { AcceptanceRateChart } from './charts/AcceptanceRateChart';
import { AverageAskRequestsChart } from './charts/AverageAskRequestsChart';
import { AverageTabsAcceptedChart } from './charts/AverageTabsAcceptedChart';
import { ModelUsageChart } from './charts/ModelUsageChart';
import { TopContributorsTable } from './charts/TopContributorsTable';
import { UserActivityChart } from './charts/UserActivityChart';
import { DayOfWeekChart } from './charts/DayOfWeekChart';
import { ApplyExtensionWordCloud } from './charts/ApplyExtensionWordCloud';
import { TabExtensionWordCloud } from './charts/TabExtensionWordCloud';
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod } from '@/utils/dataAggregation';

interface DashboardChartsProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const DashboardCharts = ({ data, aggregationPeriod }: DashboardChartsProps) => {
  return (
    <div className="space-y-8">
      {/* Main cumulative chart */}
      <CumulativeChart data={data} aggregationPeriod={aggregationPeriod} />
      
      {/* Acceptance Rate chart */}
      <AcceptanceRateChart data={data} aggregationPeriod={aggregationPeriod} />
      
      {/* Second row - Two new average charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AverageAskRequestsChart data={data} aggregationPeriod={aggregationPeriod} />
        <AverageTabsAcceptedChart data={data} aggregationPeriod={aggregationPeriod} />
      </div>
      
      {/* Third row - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModelUsageChart data={data} />
        <UserActivityChart data={data} aggregationPeriod={aggregationPeriod} />
      </div>

      {/* Fourth row - Word Cloud visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ApplyExtensionWordCloud data={data} />
        <TabExtensionWordCloud data={data} />
      </div>
      
      {/* Fifth row - Two column layout - Hide day of week chart for non-daily views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {aggregationPeriod === 'day' && <DayOfWeekChart data={data} />}
        <div className={aggregationPeriod === 'day' ? "lg:col-span-1" : "lg:col-span-2"}>
          <TopContributorsTable data={data} />
        </div>
      </div>
    </div>
  );
};
