
import { BarChart3, RefreshCcw, Settings, Download, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from "react";
import { DashboardSettings } from "./DashboardSettings";
import { useToast } from '@/hooks/use-toast';
import { exportToImage } from '@/utils/exportUtils';
import { analytics } from '@/services/analytics';

interface DashboardHeaderProps {
  showReloadButton?: boolean;
  onReloadCSV?: () => void;
  showExportButton?: boolean;
  showSettingsButton?: boolean;
}

const LINKEDIN_URL = "https://www.linkedin.com/in/zivhundert/";

export const DashboardHeader = ({ 
  showReloadButton = false, 
  onReloadCSV,
  showExportButton = false,
  showSettingsButton = true
}: DashboardHeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportToImage();
      analytics.trackExport('image');
      toast({
        title: "Image Export Successful",
        description: "Your dashboard has been downloaded as an image.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the dashboard image.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
    analytics.trackSettingsOpen();
  };

  // Component for rendering button content - reused for both mobile and desktop
  const ButtonGroup = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {showReloadButton && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onReloadCSV}
              className="h-8 w-8"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "bottom" : "left"}>
            <span>Load New CSV</span>
          </TooltipContent>
        </Tooltip>
      )}
      
      {showExportButton && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isExporting}
              onClick={handleExportImage}
              className="h-8 w-8"
            >
              <Download className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "bottom" : "left"}>
            <span>{isExporting ? 'Exporting...' : 'Export as Image'}</span>
          </TooltipContent>
        </Tooltip>
      )}
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer")}
          >
            <Linkedin className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={isMobile ? "bottom" : "left"}>
          <span>Follow on LinkedIn</span>
        </TooltipContent>
      </Tooltip>
      
      {showSettingsButton && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSettingsOpen}
              className="h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "bottom" : "left"}>
            <span>Dashboard Settings</span>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );

  return (
    <header className="text-center relative">
      {/* Mobile buttons - horizontal, top center, above title */}
      <div className="sm:hidden flex justify-center gap-2 mb-4">
        <div className="flex bg-background/80 backdrop-blur-sm border rounded-lg p-2 shadow-sm gap-2">
          <ButtonGroup isMobile={true} />
        </div>
      </div>

      {/* Desktop buttons - vertical, top right */}
      <div className="hidden sm:block absolute top-0 right-0 z-10">
        <div className="flex flex-col bg-background/80 backdrop-blur-sm border rounded-lg p-2 shadow-sm gap-1">
          <ButtonGroup isMobile={false} />
        </div>
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
        Unlock your team's full coding potential. Track real, business-driven metrics, improve productivity, and maximize the ROI of AI-assisted development with Cursor.
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
