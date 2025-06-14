
import { BarChart3, RefreshCcw, settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { LinkedInFollowButton } from "@/components/LinkedInFollowButton";
import { useState } from "react";
import { DashboardSettings } from "./DashboardSettings";

interface DashboardHeaderProps {
  showReloadButton?: boolean;
  onReloadCSV?: () => void;
}

export const DashboardHeader = ({ showReloadButton = false, onReloadCSV }: DashboardHeaderProps) => {
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
        <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} title="Dashboard settings" className="p-2">
          <settings className="w-5 h-5 text-muted-foreground" />
        </Button>
        <LinkedInFollowButton />
        <ThemeToggle />
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
        Your complete dashboard for Cursor team performance, adoption patterns, and productivity insights
      </p>
      <DashboardSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};
