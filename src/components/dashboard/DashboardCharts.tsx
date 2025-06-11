
import { CumulativeChart } from './charts/CumulativeChart';
import { ModelUsageChart } from './charts/ModelUsageChart';
import { TopContributorsTable } from './charts/TopContributorsTable';
import { UserActivityChart } from './charts/UserActivityChart';
import { CursorDataRow } from '@/pages/Index';

interface DashboardChartsProps {
  data: CursorDataRow[];
}

export const DashboardCharts = ({ data }: DashboardChartsProps) => {
  return (
    <div className="space-y-8">
      {/* First row - Full width cumulative chart */}
      <CumulativeChart data={data} />
      
      {/* Second row - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModelUsageChart data={data} />
        <UserActivityChart data={data} />
      </div>
      
      {/* Third row - Full width contributors table */}
      <TopContributorsTable data={data} />
    </div>
  );
};
