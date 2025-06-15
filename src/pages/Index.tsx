
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Settings, BarChart3 } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8" data-export="dashboard-main">
        <DashboardHeader 
          showReloadButton={originalData.length > 0} 
          onReloadCSV={handleReloadCSV}
          showExportButton={originalData.length > 0}
        />
        
        {/* Title and subtitle - always visible */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              AI Development Intelligence
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock your team's full coding potential. Track real, business-driven metrics, improve productivity, and maximize the ROI of AI-assisted development with Cursor.
          </p>
        </div>
        
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
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        )}
        
        {originalData.length > 0 && (
          <div className="mt-8 space-y-8">
            {/* Dedicated export container with only metrics, filters, and charts */}
            <div data-export="dashboard-export">
              <DashboardMetrics 
                data={filteredData} 
                originalData={originalData} 
                baseFilteredData={baseFilteredData} 
              />
              <div className="mt-8">
                <DashboardFilters 
                  data={originalData} 
                  onFiltersChange={updateFilters} 
                />
              </div>
              <div className="mt-8">
                <DashboardCharts 
                  data={filteredData} 
                  originalData={originalData} 
                  baseFilteredData={baseFilteredData} 
                  aggregationPeriod={filters.aggregationPeriod}
                  selectedUsers={filters.selectedUsers}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
