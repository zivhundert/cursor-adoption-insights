import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
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
        />
        
        {/* Onboarding panel for new users */}
        {originalData.length === 0 && (
          <div className="mt-12">
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-6 py-5 mb-8 max-w-2xl mx-auto text-teal-900 text-base flex flex-col gap-2">
              <b>First time here?</b> Upload your team's exported Cursor usage file above to start.
              <ul className="list-disc ml-6 text-sm">
                <li>This dashboard will instantly analyze team AI usage, cost savings, and opportunities for improvement.</li>
                <li>Want tips? <span className="font-semibold">Hover any <span className="inline-block align-text-bottom bg-gray-200 rounded px-1">?</span> or <span className="inline-block align-text-bottom"><Settings className="h-3 w-3 inline" /></span></span> for actionable explanations.</li>
                <li>For managers: Use dashboard insights to recognize champions, identify skills gaps, and boost adoption.</li>
              </ul>
            </div>
            <FileUpload onFileUpload={handleFileUploadWithAnalytics} isLoading={isLoading} />
          </div>
        )}
        
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
