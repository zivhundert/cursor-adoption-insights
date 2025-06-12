
import { useMemo } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
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

  const options = {
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'Inter, sans-serif',
    fontSizes: [16, 60] as [number, number],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 1,
    rotations: 3,
    rotationAngles: [-90, 0] as [number, number],
    scale: 'sqrt' as const,
    spiral: 'archimedean' as const,
    transitionDuration: 1000,
  };

  const callbacks = {
    onWordClick: (word: any) => {
      console.log(`Clicked: ${word.text} (${word.value} uses)`);
    },
    getWordTooltip: (word: any) => `${word.text}: ${word.value} uses`,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">Most Used Tab Extensions</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Visual representation of the most frequently used tab extensions.</p>
                <p className="text-sm text-muted-foreground mt-1">Larger text indicates higher usage frequency</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {wordCloudData.length > 0 ? (
            <ReactWordcloud 
              words={wordCloudData} 
              options={options} 
              callbacks={callbacks}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No tab extension data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
