import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Zap, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';

interface TopContributorsTableProps {
  data: CursorDataRow[];
  isFiltered?: boolean;
}

type PerformanceSegment = 'Power User' | 'Engaged Developer' | 'Growing User' | 'Early Explorer';

interface ContributorWithSegment {
  email: string;
  acceptedLines: number;
  suggestedLines: number;
  acceptanceRate: number;
  totalApplies: number;
  segment: PerformanceSegment;
}

const getPerformanceSegment = (acceptanceRate: number, totalApplies: number): PerformanceSegment => {
  if (acceptanceRate > 40 && totalApplies > 200) return 'Power User';
  if (acceptanceRate > 25 && totalApplies > 50) return 'Engaged Developer';
  if (acceptanceRate > 15 || totalApplies > 10) return 'Growing User';
  return 'Early Explorer';
};

const getSegmentIcon = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Power User':
      return <Zap className="h-4 w-4 text-yellow-500" />;
    case 'Engaged Developer':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Growing User':
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    case 'Early Explorer':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
  }
};

const getSegmentBadgeStyle = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Power User':
      return 'bg-green-200/70 text-green-800 border-green-300/50';
    case 'Engaged Developer':
      return 'bg-yellow-200/70 text-yellow-800 border-yellow-300/50';
    case 'Growing User':
      return 'bg-orange-200/70 text-orange-800 border-orange-300/50';
    case 'Early Explorer':
      return 'bg-gray-100/70 text-gray-800 border-gray-300/50';
  }
};

const getSegmentDescription = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Power User':
      return 'Acceptance rate > 40% and total applies > 200';
    case 'Engaged Developer':
      return 'Acceptance rate > 25% and total applies > 50';
    case 'Growing User':
      return 'Acceptance rate > 15% or total applies > 10';
    case 'Early Explorer':
      return 'Below growing user thresholds';
  }
};

export const TopContributorsTable = ({ data, isFiltered = false }: TopContributorsTableProps) => {
  const [showAll, setShowAll] = useState(false);

  const allContributors = useMemo(() => {
    // Filter out aggregated summary rows (those with special email markers)
    const userRows = data.filter(row => !row.Email.includes('active users'));
    
    const userStats = new Map<string, ContributorWithSegment>();
    
    userRows.forEach(row => {
      const email = row.Email;
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      const suggestedLines = parseInt(row['Chat Suggested Lines Added']) || 0;
      const askRequests = parseInt(row['Ask Requests']) || 0;
      
      if (!userStats.has(email)) {
        userStats.set(email, {
          email,
          acceptedLines: 0,
          suggestedLines: 0,
          acceptanceRate: 0,
          totalApplies: 0,
          segment: 'Early Explorer',
        });
      }
      
      const stats = userStats.get(email)!;
      stats.acceptedLines += acceptedLines;
      stats.suggestedLines += suggestedLines;
      stats.totalApplies += acceptedLines; // Using accepted lines as proxy for total applies
    });

    // Calculate acceptance rates and segments
    userStats.forEach(stats => {
      stats.acceptanceRate = stats.suggestedLines > 0 
        ? (stats.acceptedLines / stats.suggestedLines) * 100
        : 0;
      stats.segment = getPerformanceSegment(stats.acceptanceRate, stats.totalApplies);
    });

    return Array.from(userStats.values())
      .sort((a, b) => {
        // Sort by segment priority first, then by accepted lines
        const segmentOrder = { 'Power User': 0, 'Engaged Developer': 1, 'Growing User': 2, 'Early Explorer': 3 };
        const segmentDiff = segmentOrder[a.segment] - segmentOrder[b.segment];
        if (segmentDiff !== 0) return segmentDiff;
        return b.acceptedLines - a.acceptedLines;
      });
  }, [data]);

  // Don't render the table if there's only one user
  if (allContributors.length <= 1) {
    return null;
  }

  const displayedContributors = showAll ? allContributors : allContributors.slice(0, 7);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold">AI Adoption Champions</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Users ranked by performance segment and accepted lines.</p>
                  <p className="text-sm text-muted-foreground mt-1">Acceptance Rate = (Accepted Lines / Suggested Lines) × 100</p>
                  <div className="text-sm text-muted-foreground mt-2">
                    <p><strong>Performance Segments:</strong></p>
                    <p>⚡ Power User: Rate {'>'} 40% & Applies {'>'} 200</p>
                    <p>✅ Engaged Developer: Rate {'>'} 25% & Applies {'>'} 50</p>
                    <p>📈 Growing User: Rate {'>'} 15% or Applies {'>'} 10</p>
                    <p>⚠️ Early Explorer: Below thresholds</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {!isFiltered && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Top 7' : 'Show All'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead className="text-right">Accepted Lines</TableHead>
              <TableHead className="text-right">Suggested Lines</TableHead>
              <TableHead className="text-right">Acceptance Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedContributors.map((contributor, index) => (
              <TableRow key={contributor.email}>
                <TableCell className="font-medium">{contributor.email}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2">
                          {getSegmentIcon(contributor.segment)}
                          <Badge className={getSegmentBadgeStyle(contributor.segment)}>
                            {contributor.segment}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getSegmentDescription(contributor.segment)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right">{contributor.acceptedLines.toLocaleString()}</TableCell>
                <TableCell className="text-right">{contributor.suggestedLines.toLocaleString()}</TableCell>
                <TableCell className="text-right">{contributor.acceptanceRate.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
