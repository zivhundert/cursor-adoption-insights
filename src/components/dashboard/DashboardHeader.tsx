
import { RefreshCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkedInFollowButton } from "@/components/LinkedInFollowButton";
import { useState } from "react";
import { DashboardSettings } from "./DashboardSettings";
import { ExportButton } from "./ExportButton";

interface DashboardHeaderProps {
  showReloadButton?: boolean;
  onReloadCSV?: () => void;
  showExportButton?: boolean;
}

export const DashboardHeader = ({ 
  showReloadButton = false, 
  onReloadCSV,
  showExportButton = false
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
        {showExportButton && <ExportButton />}
        <LinkedInFollowButton />
        <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} title="Dashboard settings" className="p-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
      
      <DashboardSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};
