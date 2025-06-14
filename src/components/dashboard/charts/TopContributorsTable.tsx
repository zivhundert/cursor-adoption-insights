
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Lightning, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';

interface TopContributorsTableProps {
  data: CursorDataRow[];
  isFiltered?: boolean;
}

type PerformanceSegment = 'Power User' | 'Regular User' | 'Developing User' | 'At Risk';

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
  if (acceptanceRate > 25 && totalApplies > 50) return 'Regular User';
  if (acceptanceRate > 15 || totalApplies > 10) return 'Developing User';
  return 'At Risk';
};

const getSegmentIcon = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Power User':
      return <Lightning className="h-4 w-4 text-yellow-500" />;
    case 'Regular User':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Developing User':
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    case 'At Risk':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
  }
};

const getSegmentBadgeVariant = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Power User':
      return 'default';
    case 'Regular User':
      return 'secondary';
    case 'Developing User':
      return 'outline';
    case 'At Risk':
      return 'destructive';
  }
};

const getSegmentDescription = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Power User':
      return 'Acceptance rate > 40% and total applies > 200';
    case 'Regular User':
      return 'Acceptance rate > 25% and total applies > 50';
    case 'Developing User':
      return 'Acceptance rate > 15% or total applies > 10';
    case 'At Risk':
      return 'Below developing user thresholds';
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
          segment: 'At Risk',
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
        const segmentOrder = { 'Power User': 0, 'Regular User': 1, 'Developing User': 2, 'At Risk': 3 };
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
                    <p>⚡ Power User: Rate > 40% & Applies > 200</p>
                    <p>✅ Regular User: Rate > 25% & Applies > 50</p>
                    <p>📈 Developing User: Rate > 15% or Applies > 10</p>
                    <p>⚠️ At Risk: Below thresholds</p>
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
                          <Badge variant={getSegmentBadgeVariant(contributor.segment)}>
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
