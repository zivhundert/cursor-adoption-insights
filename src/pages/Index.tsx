import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { toast } from '@/hooks/use-toast';
import { aggregateDataByPeriod, type AggregationPeriod } from '@/utils/dataAggregation';

export interface CursorDataRow {
  Date: string;
  Email: string;
  'User ID': string;
  'Is Active': string;
  'Ask Requests': string;
  'Edit Requests': string;
  'Agent Requests': string;
  'Bugbot Requests': string;
  'Cmd+K Requests': string;
  'API Requests': string;
  'Chat Suggested Lines Added': string;
  'Chat Accepted Lines Added': string;
  'Tabs Accepted': string;
  'Most Used Model': string;
  'Most Used Apply Extension': string;
  'Most Used Tab Extension': string;
}

const Index = () => {
  const [data, setData] = useState<CursorDataRow[]>([]);
  const [filteredData, setFilteredData] = useState<CursorDataRow[]>([]);
  const [baseFilteredData, setBaseFilteredData] = useState<CursorDataRow[]>([]);
  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>('day');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const parsedData: CursorDataRow[] = rows.slice(1)
        .filter(row => row.trim())
        .map(row => {
          const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });
          return rowData as CursorDataRow;
        })
        .filter(row => row['Is Active'].toLowerCase() === 'true'); // Only include active users

      setData(parsedData);
      setFilteredData(parsedData);
      setBaseFilteredData(parsedData);
      toast({
        title: "File uploaded successfully",
        description: `Processed ${parsedData.length} rows of active user data`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please check your CSV format and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (filters: {
    dateRange: { from?: Date; to?: Date };
    selectedUser: string;
    selectedModel: string;
    aggregationPeriod: AggregationPeriod;
  }) => {
    let filtered = [...data];

    // Filter by date range
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(row => {
        const rowDate = new Date(row.Date);
        if (filters.dateRange.from && rowDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && rowDate > filters.dateRange.to) return false;
        return true;
      });
    }

    // Filter by user
    if (filters.selectedUser !== 'all') {
      filtered = filtered.filter(row => row.Email === filters.selectedUser);
    }

    // Filter by model
    if (filters.selectedModel !== 'all') {
      filtered = filtered.filter(row => row['Most Used Model'] === filters.selectedModel);
    }

    // Store base filtered data (without time period aggregation)
    setBaseFilteredData(filtered);

    // Apply aggregation for charts that need it
    const aggregatedData = aggregateDataByPeriod(filtered, filters.aggregationPeriod);
    
    setAggregationPeriod(filters.aggregationPeriod);
    setFilteredData(aggregatedData);
  };

  const handleReloadCSV = () => {
    setData([]);
    setFilteredData([]);
    setBaseFilteredData([]);
    setAggregationPeriod('day');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader showReloadButton={data.length > 0} onReloadCSV={handleReloadCSV} />
        
        {data.length === 0 ? (
          <div className="mt-12">
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <DashboardMetrics data={filteredData} originalData={data} baseFilteredData={baseFilteredData} />
            <DashboardFilters data={data} onFiltersChange={handleFiltersChange} />
            <DashboardCharts data={filteredData} originalData={data} baseFilteredData={baseFilteredData} aggregationPeriod={aggregationPeriod} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
