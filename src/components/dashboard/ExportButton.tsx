
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { exportToImage } from '@/utils/exportUtils';

export const ExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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
    <Button variant="outline" size="sm" disabled={isExporting} onClick={handleExportImage}>
      <Download className="w-4 h-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export as Image'}
    </Button>
  );
};
