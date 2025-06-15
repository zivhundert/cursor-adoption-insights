
import { useState } from 'react';
import { CursorDataRow } from '@/pages/Index';
import { parseCSVFile } from '@/utils/csvParser';
import { toast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [data, setData] = useState<CursorDataRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      const result = await parseCSVFile(file);
      
      if (result.error) {
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setData(result.data);
      toast({
        title: "File uploaded successfully",
        description: `Processed ${result.data.length} rows of active user data`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred while processing the file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetData = () => {
    setData([]);
  };

  return {
    data,
    isLoading,
    handleFileUpload,
    resetData
  };
};
