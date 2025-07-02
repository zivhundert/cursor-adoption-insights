
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { ExampleShowcase } from '@/components/dashboard/ExampleShowcase';
import { PrivacyFooter } from '@/components/common/PrivacyFooter';
import { useDashboardData } from '@/hooks/useDashboardData';
import { analytics } from '@/services/analytics';
import { Settings } from 'lucide-react';

export interface CursorDataRow {
  Date: string;
  'User ID': string;
  Email: string;
  'Is Active': string;
  'Chat Suggested Lines Added': string;
  'Chat Suggested Lines Deleted': string;
  'Chat Accepted Lines Added': string;
  'Chat Accepted Lines Deleted': string;
  'Chat Total Applies': string;
  'Chat Total Accepts': string;
  'Chat Total Rejects': string;
  'Chat Tabs Shown': string;
  'Tabs Accepted': string;
  'Edit Requests': string;
  'Ask Requests': string;
  'Agent Requests': string;
  'Cmd+K Usages': string;
  'Subscription Included Reqs': string;
  'API Key Reqs': string;
  'Usage Based Reqs': string;
  'Bugbot Usages': string;
  'Most Used Model': string;
  'Most Used Apply Extension': string;
  'Most Used Tab Extension': string;
  'Client Version': string;
}

const Index = () => {
  const {
    originalData,
    filteredData,
    baseFilteredData,
    isLoading,
    handleFileUpload,
    updateFilters,
    handleReloadCSV,
    filters
  } = useDashboardData();

  // Enhanced file upload handler with analytics
  const handleFileUploadWithAnalytics = (data: any) => {
    handleFileUpload(data);
    analytics.trackFileUpload(data.length);
  };

  // Enhanced reload handler with analytics
  const handleReloadCSVWithAnalytics = () => {
    handleReloadCSV();
    analytics.trackCsvReload();
  };

  // Enhanced filters handler with analytics
  const updateFiltersWithAnalytics = (newFilters: any) => {
    updateFilters(newFilters);
    // Track which filter was used
    Object.keys(newFilters).forEach(filterKey => {
      analytics.trackFilterUsage(filterKey);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8" data-export="dashboard-main">
        <DashboardHeader 
          showReloadButton={originalData.length > 0} 
          onReloadCSV={handleReloadCSVWithAnalytics}
          showExportButton={originalData.length > 0}
          showSettingsButton={originalData.length > 0}
        />
        
        {/* Show content only when no data is uploaded */}
        {originalData.length === 0 && (
          <div className="mt-12">
            {/* Example Showcase - New Eye-Catching Section */}
            <ExampleShowcase />
            
            
            <div data-upload-section>
              <FileUpload onFileUpload={handleFileUploadWithAnalytics} isLoading={isLoading} />
            </div>
          </div>
        )}
        
        {/* Show dashboard when data is uploaded */}
        {originalData.length > 0 && (
          <div className="mt-8 space-y-8">
            <DashboardMetrics 
              data={filteredData} 
              originalData={originalData} 
              baseFilteredData={baseFilteredData} 
            />
            <DashboardFilters 
              data={originalData} 
              onFiltersChange={updateFiltersWithAnalytics} 
            />
            <div data-export="dashboard-charts">
              <DashboardCharts 
                data={filteredData} 
                originalData={originalData} 
                baseFilteredData={baseFilteredData} 
                aggregationPeriod={filters.aggregationPeriod}
                selectedUsers={filters.selectedUsers}
              />
            </div>
          </div>
        )}
      </div>
      <PrivacyFooter />
    </div>
  );
};

export default Index;
