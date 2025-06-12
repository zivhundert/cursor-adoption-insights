
import { useMemo } from 'react';
import { EnhancedWordCloud } from './EnhancedWordCloud';
import { CursorDataRow } from '@/pages/Index';

interface TabExtensionWordCloudProps {
  data: CursorDataRow[];
}

export const TabExtensionWordCloud = ({ data }: TabExtensionWordCloudProps) => {
  const wordCloudData = useMemo(() => {
    const extensionCounts = new Map<string, number>();
    
    data.forEach(row => {
      const extension = row['Most Used Tab Extension'];
      if (extension && extension.trim() && extension !== 'Unknown' && extension !== '') {
        extensionCounts.set(extension, (extensionCounts.get(extension) || 0) + 1);
      }
    });

    return Array.from(extensionCounts.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  return (
    <EnhancedWordCloud 
      data={wordCloudData}
      title="Most Used Tab Extensions"
      helpText="Visual representation of the most frequently used tab extensions."
      colors={colors}
    />
  );
};
