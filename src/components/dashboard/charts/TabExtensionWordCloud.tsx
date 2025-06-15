
import { useMemo } from 'react';
import { ChartContainer } from '@/components/common/ChartContainer';
import { CursorDataRow } from '@/pages/Index';

interface TabExtensionWordCloudProps {
  data: CursorDataRow[];
}

interface PositionedWord {
  text: string;
  value: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotation: number;
  width: number;
  height: number;
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
  const maxValue = Math.max(...wordCloudData.map(item => item.value), 1);

  // Simple word cloud layout - arrange words in a grid-like pattern
  const positionedWords: PositionedWord[] = useMemo(() => {
    const containerWidth = 600;
    const containerHeight = 380;
    
    return wordCloudData.map((item, index) => {
      const fontSize = Math.max(14, Math.min(48, (item.value / maxValue) * 42 + 14));
      const color = colors[index % colors.length];
      
      // Simple positioning algorithm
      const cols = 4;
      const rows = Math.ceil(wordCloudData.length / cols);
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = (col + 0.5) * (containerWidth / cols) - (item.text.length * fontSize * 0.3);
      const y = (row + 0.5) * (containerHeight / rows);
      
      return {
        ...item,
        x: Math.max(10, Math.min(containerWidth - item.text.length * fontSize * 0.6, x)),
        y: Math.max(20, Math.min(containerHeight - fontSize, y)),
        fontSize,
        color,
        rotation: (Math.random() - 0.5) * 30,
        width: item.text.length * fontSize * 0.6,
        height: fontSize * 1.2
      };
    });
  }, [wordCloudData, maxValue, colors]);

  const isEmpty = wordCloudData.length === 0;

  return (
    <ChartContainer
      title="Most Used Tab Extensions"
      helpText="Visual representation of the most frequently used tab extensions. Larger text indicates higher usage frequency."
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No tab extension data available
        </div>
      ) : (
        <div className="relative h-full w-full overflow-hidden">
          {positionedWords.map((word, index) => (
            <span
              key={`${word.text}-${index}`}
              className="absolute cursor-pointer hover:opacity-80 transition-all duration-200 font-semibold select-none hover:scale-110"
              style={{
                left: `${word.x}px`,
                top: `${word.y}px`,
                fontSize: `${word.fontSize}px`,
                color: word.color,
                transform: `rotate(${word.rotation}deg)`,
                transformOrigin: 'center',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
              title={`${word.text}: ${word.value} uses`}
            >
              {word.text}
            </span>
          ))}
        </div>
      )}
    </ChartContainer>
  );
};
