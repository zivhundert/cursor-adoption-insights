
import { useMemo, useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface WordCloudItem {
  text: string;
  value: number;
}

interface EnhancedWordCloudProps {
  data: WordCloudItem[];
  title: string;
  helpText: string;
  colors: string[];
}

interface PositionedWord extends WordCloudItem {
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotation: number;
  width: number;
  height: number;
}

export const EnhancedWordCloud = ({ data, title, helpText, colors }: EnhancedWordCloudProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positionedWords, setPositionedWords] = useState<PositionedWord[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const maxValue = Math.max(...data.map(item => item.value), 1);

  // Calculate font sizes and prepare words
  const wordsWithSizes = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fontSize: Math.max(14, Math.min(48, (item.value / maxValue) * 42 + 14)),
      color: colors[index % colors.length],
      rotation: Math.random() * 60 - 30, // Random rotation between -30 and 30 degrees
    }));
  }, [data, maxValue, colors]);

  // Collision detection function
  const checkCollision = (word1: PositionedWord, word2: PositionedWord): boolean => {
    const padding = 8;
    return !(
      word1.x + word1.width + padding < word2.x ||
      word2.x + word2.width + padding < word1.x ||
      word1.y + word1.height + padding < word2.y ||
      word2.y + word2.height + padding < word1.y
    );
  };

  // Spiral positioning algorithm
  const positionWords = () => {
    if (!containerRef.current || wordsWithSizes.length === 0) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    setContainerSize({ width: containerWidth, height: containerHeight });

    const positioned: PositionedWord[] = [];
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    wordsWithSizes.forEach((word) => {
      // Estimate word dimensions (rough approximation)
      const estimatedWidth = word.text.length * word.fontSize * 0.6;
      const estimatedHeight = word.fontSize * 1.2;

      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      let radius = 0;
      let angle = 0;

      while (!placed && attempts < maxAttempts) {
        let x, y;

        if (attempts === 0) {
          // Try center first
          x = centerX - estimatedWidth / 2;
          y = centerY - estimatedHeight / 2;
        } else {
          // Spiral outward
          const angleStep = 0.3;
          angle += angleStep;
          radius += 0.5;
          
          x = centerX + Math.cos(angle) * radius - estimatedWidth / 2;
          y = centerY + Math.sin(angle) * radius - estimatedHeight / 2;
        }

        // Ensure word stays within container bounds
        x = Math.max(10, Math.min(containerWidth - estimatedWidth - 10, x));
        y = Math.max(10, Math.min(containerHeight - estimatedHeight - 10, y));

        const candidateWord: PositionedWord = {
          ...word,
          x,
          y,
          width: estimatedWidth,
          height: estimatedHeight,
        };

        // Check for collisions with already positioned words
        const hasCollision = positioned.some(positionedWord => 
          checkCollision(candidateWord, positionedWord)
        );

        if (!hasCollision) {
          positioned.push(candidateWord);
          placed = true;
        }

        attempts++;
      }

      // If we couldn't place the word after max attempts, place it anyway
      if (!placed) {
        const fallbackX = Math.random() * (containerWidth - estimatedWidth);
        const fallbackY = Math.random() * (containerHeight - estimatedHeight);
        
        positioned.push({
          ...word,
          x: fallbackX,
          y: fallbackY,
          width: estimatedWidth,
          height: estimatedHeight,
        });
      }
    });

    setPositionedWords(positioned);
  };

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(positionWords, 100); // Debounce resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wordsWithSizes]);

  // Position words when data changes or container is ready
  useEffect(() => {
    const timer = setTimeout(positionWords, 100);
    return () => clearTimeout(timer);
  }, [wordsWithSizes]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{helpText}</p>
                <p className="text-sm text-muted-foreground mt-1">Larger text indicates higher usage frequency</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="relative h-80 w-full overflow-hidden"
          style={{ minHeight: '320px' }}
        >
          {positionedWords.length > 0 ? (
            positionedWords.map((word, index) => (
              <TooltipProvider key={`${word.text}-${index}`}>
                <Tooltip>
                  <TooltipTrigger>
                    <span
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
                      onClick={() => console.log(`Clicked: ${word.text} (${word.value} uses)`)}
                    >
                      {word.text}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{word.text}: {word.value} uses</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
