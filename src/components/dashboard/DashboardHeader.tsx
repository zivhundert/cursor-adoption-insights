import { BarChart3, RefreshCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkedInFollowButton } from "@/components/LinkedInFollowButton";
import { useState } from "react";
import { DashboardSettings } from "./DashboardSettings";
import { ExportButton } from "./ExportButton";
import { CursorDataRow } from '@/pages/Index';

interface DashboardHeaderProps {
  showReloadButton?: boolean;
  onReloadCSV?: () => void;
  showExportButton?: boolean;
  exportData?: {
    data: CursorDataRow[];
    originalData: CursorDataRow[];
    filters: {
      dateRange: { from?: Date; to?: Date };
      selectedUsers: string[];
      aggregationPeriod: string;
    };
  };
}

export const DashboardHeader = ({ 
  showReloadButton = false, 
  onReloadCSV,
  showExportButton = false,
  exportData
}: DashboardHeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="text-center relative">
      <div className="absolute top-0 right-0 flex items-center gap-2 z-10">
        {showReloadButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReloadCSV}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Load New CSV
          </Button>
        )}
        {showExportButton && exportData && (
          <ExportButton 
            data={exportData.data}
            originalData={exportData.originalData}
            filters={exportData.filters}
          />
        )}
        <LinkedInFollowButton />
        <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} title="Dashboard settings" className="p-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          AI Development Intelligence
        </h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Unlock your team’s full coding potential. Track real, business-driven metrics, improve productivity, and maximize the ROI of AI-assisted development with Cursor.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-xl mx-auto mt-4 mb-2 text-blue-900">
        <strong>Welcome!</strong> This dashboard reveals how AI accelerates your team. 
        <ul className="list-disc text-base text-left ml-6 mt-2">
          <li><b>See cost savings</b> and time saved by your developers using AI.</li>
          <li><b>Spot your AI Champions</b> and help others grow.</li>
          <li><b>Adjust settings</b> for accurate ROI reporting (see top right wheel).</li>
        </ul>
        <div className="text-sm mt-2">Not sure how to interpret metrics? Hover <span className="inline-block align-text-bottom"><Settings className="h-4 w-4 inline" /></span> or question marks for insights.</div>
      </div>
      <DashboardSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};
