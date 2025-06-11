
import { CumulativeChart } from './charts/CumulativeChart';
import { CumulativeAskRequestsChart } from './charts/CumulativeAskRequestsChart';
import { CumulativeTabsAcceptedChart } from './charts/CumulativeTabsAcceptedChart';
import { ModelUsageChart } from './charts/ModelUsageChart';
import { TopContributorsTable } from './charts/TopContributorsTable';
import { UserActivityChart } from './charts/UserActivityChart';
import { DayOfWeekChart } from './charts/DayOfWeekChart';
import { CursorDataRow } from '@/pages/Index';

interface DashboardChartsProps {
  data: CursorDataRow[];
}

export const DashboardCharts = ({ data }: DashboardChartsProps) => {
  return (
    <div className="space-y-8">
      {/* First row - Full width cumulative chart */}
      <CumulativeChart data={data} />
      
      {/* Second row - Two new cumulative charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CumulativeAskRequestsChart data={data} />
        <CumulativeTabsAcceptedChart data={data} />
      </div>
      
      {/* Third row - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModelUsageChart data={data} />
        <UserActivityChart data={data} />
      </div>
      
      {/* Fourth row - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DayOfWeekChart data={data} />
        <div className="lg:col-span-1">
          <TopContributorsTable data={data} />
        </div>
      </div>
    </div>
  );
};
