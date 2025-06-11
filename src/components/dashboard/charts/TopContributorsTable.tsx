
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CursorDataRow } from '@/pages/Index';

interface TopContributorsTableProps {
  data: CursorDataRow[];
}

export const TopContributorsTable = ({ data }: TopContributorsTableProps) => {
  const topContributors = useMemo(() => {
    const userStats = new Map<string, {
      email: string;
      acceptedLines: number;
      suggestedLines: number;
      acceptanceRate: number;
    }>();
    
    data.forEach(row => {
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
      .sort((a, b) => b.acceptedLines - a.acceptedLines)
      .slice(0, 10);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Top Contributors</CardTitle>
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
            {topContributors.map((contributor, index) => (
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
