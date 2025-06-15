
import { useFileUpload } from './useFileUpload';
import { useDataFiltering } from './useDataFiltering';

export const useDashboardData = () => {
  const fileUpload = useFileUpload();
  const dataFiltering = useDataFiltering(fileUpload.data);

  const handleReloadCSV = () => {
    fileUpload.resetData();
    dataFiltering.resetFilters();
  };

  return {
    // File upload data and methods
    originalData: fileUpload.data,
    isLoading: fileUpload.isLoading,
    handleFileUpload: fileUpload.handleFileUpload,
    
    // Filtered data and methods
    filteredData: dataFiltering.filteredData,
    baseFilteredData: dataFiltering.baseFilteredData,
    filters: dataFiltering.filters,
    updateFilters: dataFiltering.updateFilters,
    
    // Combined methods
    handleReloadCSV
  };
};
