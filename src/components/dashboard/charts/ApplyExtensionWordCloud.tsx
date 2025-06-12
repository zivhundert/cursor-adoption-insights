
import { useMemo } from 'react';
import { EnhancedWordCloud } from './EnhancedWordCloud';
import { CursorDataRow } from '@/pages/Index';

interface ApplyExtensionWordCloudProps {
  data: CursorDataRow[];
}

export const ApplyExtensionWordCloud = ({ data }: ApplyExtensionWordCloudProps) => {
  const wordCloudData = useMemo(() => {
    const extensionCounts = new Map<string, number>();
    
    data.forEach(row => {
      const extension = row['Most Used Apply Extension'];
      if (extension && extension.trim() && extension !== 'Unknown' && extension !== '') {
        extensionCounts.set(extension, (extensionCounts.get(extension) || 0) + 1);
      }
    });

    return Array.from(extensionCounts.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

  return (
    <EnhancedWordCloud 
      data={wordCloudData}
      title="Most Used Apply Extensions"
      helpText="Visual representation of the most frequently used apply extensions."
      colors={colors}
    />
  );
};
