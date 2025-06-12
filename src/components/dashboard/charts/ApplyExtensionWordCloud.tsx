
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
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

  const maxValue = Math.max(...wordCloudData.map(item => item.value), 1);
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">Most Used Apply Extensions</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Visual representation of the most frequently used apply extensions.</p>
                <p className="text-sm text-muted-foreground mt-1">Larger text indicates higher usage frequency</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-wrap items-center justify-center gap-2 p-4">
          {wordCloudData.length > 0 ? (
            wordCloudData.map((item, index) => {
              const fontSize = Math.max(12, (item.value / maxValue) * 48);
              const color = colors[index % colors.length];
              return (
                <TooltipProvider key={item.text}>
                  <Tooltip>
                    <TooltipTrigger>
                      <span
                        className="cursor-pointer hover:opacity-80 transition-opacity font-medium"
                        style={{
                          fontSize: `${fontSize}px`,
                          color: color,
                          lineHeight: 1.2,
                        }}
                        onClick={() => console.log(`Clicked: ${item.text} (${item.value} uses)`)}
                      >
                        {item.text}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.text}: {item.value} uses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No apply extension data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
