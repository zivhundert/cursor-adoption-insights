
import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from './filters/DateRangePicker';
import { UserSelector } from './filters/UserSelector';
import { AggregationPeriodSelector } from './filters/AggregationPeriodSelector';
import { FilterActions } from './filters/FilterActions';
import type { CursorDataRow } from '@/pages/Index';
import type { DateRange } from 'react-day-picker';
import type { AggregationPeriod } from '@/utils/dataAggregation';

interface DashboardFiltersProps {
  data: CursorDataRow[];
  onFiltersChange: (filters: {
    dateRange: { from?: Date; to?: Date };
    selectedUsers: string[];
    aggregationPeriod: AggregationPeriod;
  }) => void;
}

export const DashboardFilters = ({ data, onFiltersChange }: DashboardFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>('day');

  const uniqueUsers = Array.from(new Set(data.map(row => row.Email))).sort();

  const handleFilterChange = () => {
    onFiltersChange({
      dateRange: {
        from: dateRange?.from,
        to: dateRange?.to,
      },
      selectedUsers,
      aggregationPeriod,
    });
  };

  const clearFilters = () => {
    setDateRange(undefined);
    setSelectedUsers([]);
    setAggregationPeriod('day');
    onFiltersChange({
      dateRange: {},
      selectedUsers: [],
      aggregationPeriod: 'day',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DateRangePicker
            data={data}
            value={dateRange}
            onChange={setDateRange}
          />
          
          <AggregationPeriodSelector
            value={aggregationPeriod}
            onChange={setAggregationPeriod}
          />
          
          <UserSelector
            users={uniqueUsers}
            selectedUsers={selectedUsers}
            onChange={setSelectedUsers}
          />
          
          <FilterActions
            onApply={handleFilterChange}
            onClear={clearFilters}
          />
        </div>
      </CardContent>
    </Card>
  );
};
