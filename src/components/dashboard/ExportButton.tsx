
import React, { useState } from 'react';
import { Download, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { exportToPDF } from '@/utils/exportUtils';
import { exportToImage } from '@/utils/exportUtils';
import { CursorDataRow } from '@/pages/Index';

interface ExportButtonProps {
  data: CursorDataRow[];
  originalData: CursorDataRow[];
  filters: {
    dateRange: { from?: Date; to?: Date };
    selectedUsers: string[];
    aggregationPeriod: string;
  };
}

export const ExportButton = ({ data, originalData, filters }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(data, filters);
      toast({
        title: "PDF Export Successful",
        description: "Your dashboard report has been downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF report.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportToImage();
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleExportImage}>
          <Image className="w-4 h-4 mr-2" />
          Export as Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
