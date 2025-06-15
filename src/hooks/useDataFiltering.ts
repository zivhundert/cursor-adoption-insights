
import { useState, useMemo } from 'react';
import { CursorDataRow } from '@/pages/Index';
import { aggregateDataByPeriod, type AggregationPeriod } from '@/utils/dataAggregation';

interface FilterOptions {
  dateRange: { from?: Date; to?: Date };
  selectedUsers: string[];
  aggregationPeriod: AggregationPeriod;
}

export const useDataFiltering = (originalData: CursorDataRow[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {},
    selectedUsers: [],
    aggregationPeriod: 'day'
  });

  const { filteredData, baseFilteredData } = useMemo(() => {
    let filtered = [...originalData];

    // Filter by date range
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(row => {
        const rowDate = new Date(row.Date);
        if (filters.dateRange.from && rowDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && rowDate > filters.dateRange.to) return false;
        return true;
      });
    }

    // Filter by users
    if (filters.selectedUsers.length > 0) {
      filtered = filtered.filter(row => filters.selectedUsers.includes(row.Email));
    }

    const baseFiltered = filtered;
    const aggregatedData = aggregateDataByPeriod(filtered, filters.aggregationPeriod);

    return {
      filteredData: aggregatedData,
      baseFilteredData: baseFiltered
    };
  }, [originalData, filters]);

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {},
      selectedUsers: [],
      aggregationPeriod: 'day'
    });
  };

  return {
    filteredData,
    baseFilteredData,
    filters,
    updateFilters,
    resetFilters
  };
};
