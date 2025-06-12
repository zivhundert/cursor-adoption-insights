import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { toast } from '@/hooks/use-toast';
import { aggregateDataByPeriod, type AggregationPeriod } from '@/utils/dataAggregation';
import { campaignService, Campaign } from '@/services/campaignService';

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
  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>('day');
  const [isLoading, setIsLoading] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [hasUnsavedData, setHasUnsavedData] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    selectedUser: 'all',
    selectedModel: 'all',
    aggregationPeriod: 'day' as AggregationPeriod,
  });

  // Load the most recent campaign on startup
  useEffect(() => {
    const campaigns = campaignService.getAllCampaigns();
    if (campaigns.length > 0) {
      const mostRecent = campaigns.sort((a, b) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      )[0];
      handleCampaignSelect(mostRecent);
    }
  }, []);

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
        });

      setData(parsedData);
      setFilteredData(parsedData);
      setCurrentCampaign(null);
      setHasUnsavedData(true);
      
      // Reset filters to default
      const defaultFilters = {
        dateRange: { from: undefined, to: undefined },
        selectedUser: 'all',
        selectedModel: 'all',
        aggregationPeriod: 'day' as AggregationPeriod,
      };
      setCurrentFilters(defaultFilters);
      setAggregationPeriod('day');
      
      toast({
        title: "File uploaded successfully",
        description: `Processed ${parsedData.length} rows of data`,
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
    setCurrentFilters(filters);
    
    let filtered = [...data];

    // Apply all filters...
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(row => {
        const rowDate = new Date(row.Date);
        if (filters.dateRange.from && rowDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && rowDate > filters.dateRange.to) return false;
        return true;
      });
    }

    if (filters.selectedUser !== 'all') {
      filtered = filtered.filter(row => row.Email === filters.selectedUser);
    }

    if (filters.selectedModel !== 'all') {
      filtered = filtered.filter(row => row['Most Used Model'] === filters.selectedModel);
    }

    const aggregatedData = aggregateDataByPeriod(filtered, filters.aggregationPeriod);
    
    setAggregationPeriod(filters.aggregationPeriod);
    setFilteredData(aggregatedData);

    // Update campaign with current filters if one is selected
    if (currentCampaign) {
      const updatedCampaign = {
        ...currentCampaign,
        lastFilters: filters,
      };
      campaignService.saveCampaign(updatedCampaign);
      setCurrentCampaign(updatedCampaign);
    }
  };

  const handleReloadCSV = () => {
    setData([]);
    setFilteredData([]);
    setAggregationPeriod('day');
    setCurrentCampaign(null);
    setHasUnsavedData(false);
    setCurrentFilters({
      dateRange: { from: undefined, to: undefined },
      selectedUser: 'all',
      selectedModel: 'all',
      aggregationPeriod: 'day',
    });
  };

  const handleCampaignSelect = (campaign: Campaign | null) => {
    if (campaign) {
      setData(campaign.data);
      setCurrentCampaign(campaign);
      setHasUnsavedData(false);
      
      // Apply saved filters if they exist
      if (campaign.lastFilters) {
        handleFiltersChange(campaign.lastFilters);
      } else {
        setFilteredData(campaign.data);
        setAggregationPeriod('day');
      }
      
      toast({
        title: "Campaign loaded",
        description: `"${campaign.name}" has been loaded`,
      });
    } else {
      handleReloadCSV();
    }
  };

  const handleSaveCampaign = (name: string) => {
    try {
      const campaign = campaignService.createCampaign(name, data);
      campaign.lastFilters = currentFilters;
      campaignService.saveCampaign(campaign);
      setCurrentCampaign(campaign);
      setHasUnsavedData(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save campaign",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          showReloadButton={data.length > 0} 
          onReloadCSV={handleReloadCSV}
          currentCampaign={currentCampaign}
          onCampaignSelect={handleCampaignSelect}
          onSaveCampaign={handleSaveCampaign}
          hasUnsavedData={hasUnsavedData}
        />
        
        {data.length === 0 ? (
          <div className="mt-12">
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <DashboardMetrics data={filteredData} originalData={data} />
            <DashboardFilters data={data} onFiltersChange={handleFiltersChange} />
            <DashboardCharts data={filteredData} aggregationPeriod={aggregationPeriod} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
