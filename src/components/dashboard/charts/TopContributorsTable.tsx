
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { CursorDataRow } from '@/pages/Index';

interface TopContributorsTableProps {
  data: CursorDataRow[];
}

export const TopContributorsTable = ({ data }: TopContributorsTableProps) => {
  const [showAll, setShowAll] = useState(false);

  const allContributors = useMemo(() => {
    // Filter out aggregated summary rows (those with special email markers)
    const userRows = data.filter(row => !row.Email.includes('active users'));
    
    const userStats = new Map<string, {
      email: string;
      acceptedLines: number;
      suggestedLines: number;
      acceptanceRate: number;
    }>();
    
    userRows.forEach(row => {
      const email = row.Email;
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      const suggestedLines = parseInt(row['Chat Suggested Lines Added']) || 0;
      
      if (!userStats.has(email)) {
        userStats.set(email, {
          email,
          acceptedLines: 0,
          suggestedLines: 0,
          acceptanceRate: 0,
        });
      }
      
      const stats = userStats.get(email)!;
      stats.acceptedLines += acceptedLines;
      stats.suggestedLines += suggestedLines;
    });

    // Calculate acceptance rates
    userStats.forEach(stats => {
      stats.acceptanceRate = stats.suggestedLines > 0 
        ? (stats.acceptedLines / stats.suggestedLines) * 100
        : 0;
    });

    return Array.from(userStats.values())
      .sort((a, b) => b.acceptedLines - a.acceptedLines);
  }, [data]);

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
                  <p>Users ranked by total accepted lines.</p>
                  <p className="text-sm text-muted-foreground mt-1">Acceptance Rate = (Accepted Lines / Suggested Lines) × 100</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Top 7' : 'Show All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Accepted Lines</TableHead>
              <TableHead className="text-right">Suggested Lines</TableHead>
              <TableHead className="text-right">Acceptance Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedContributors.map((contributor, index) => (
              <TableRow key={contributor.email}>
                <TableCell className="font-medium">{contributor.email}</TableCell>
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
