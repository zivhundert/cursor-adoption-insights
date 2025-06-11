
import { CumulativeChart } from './charts/CumulativeChart';
import { CumulativeAskRequestsChart } from './charts/CumulativeAskRequestsChart';
import { CumulativeTabsAcceptedChart } from './charts/CumulativeTabsAcceptedChart';
import { ModelUsageChart } from './charts/ModelUsageChart';
import { TopContributorsTable } from './charts/TopContributorsTable';
import { UserActivityChart } from './charts/UserActivityChart';
import { DayOfWeekChart } from './charts/DayOfWeekChart';
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod } from '@/utils/dataAggregation';

interface DashboardChartsProps {
  data: CursorDataRow[];
  aggregationPeriod: AggregationPeriod;
}

export const DashboardCharts = ({ data, aggregationPeriod }: DashboardChartsProps) => {
  return (
    <div className="space-y-8">
      {/* First row - Full width cumulative chart */}
      <CumulativeChart data={data} aggregationPeriod={aggregationPeriod} />
      
      {/* Second row - Two new cumulative charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CumulativeAskRequestsChart data={data} aggregationPeriod={aggregationPeriod} />
        <CumulativeTabsAcceptedChart data={data} aggregationPeriod={aggregationPeriod} />
      </div>
      
      {/* Third row - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModelUsageChart data={data} />
        <UserActivityChart data={data} aggregationPeriod={aggregationPeriod} />
      </div>
      
      {/* Fourth row - Two column layout - Hide day of week chart for non-daily views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {aggregationPeriod === 'day' && <DayOfWeekChart data={data} />}
        <div className={aggregationPeriod === 'day' ? "lg:col-span-1" : "lg:col-span-2"}>
          <TopContributorsTable data={data} />
        </div>
      </div>
    </div>
  );
};
