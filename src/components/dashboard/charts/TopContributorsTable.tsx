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
  chatTotalApplies: number;
  tabsAccepted: number;
  editRequests: number;
  askRequests: number;
  agentRequests: number;
  cmdKRequests: number;
  segment: PerformanceSegment;
}

// Added: sorting options
type SortableColumn =
  | "email"
  | "segment"
  | "acceptedLines"
  | "suggestedLines"
  | "acceptanceRate"
  | "chatTotalApplies"
  | "tabsAccepted"
  | "editRequests"
  | "askRequests"
  | "agentRequests"
  | "cmdKRequests";

const columnLabels: Record<SortableColumn, string> = {
  email: "Name",
  segment: "Performance",
  acceptedLines: "Accepted Lines",
  suggestedLines: "Suggested Lines",
  acceptanceRate: "Acceptance Rate",
  chatTotalApplies: "Chat Total Applies",
  tabsAccepted: "Tabs Accepted",
  editRequests: "Edit Requests",
  askRequests: "Ask Requests",
  agentRequests: "Agent Requests",
  cmdKRequests: "Cmd+K Requests",
};

const getPerformanceSegment = (acceptanceRate: number, chatTotalApplies: number): PerformanceSegment => {
  if (acceptanceRate > 40 && chatTotalApplies > 200) return 'Power User';
  if (acceptanceRate > 25 && chatTotalApplies > 50) return 'Engaged Developer';
  if (acceptanceRate > 15 || chatTotalApplies > 10) return 'Growing User';
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

// sort helper for segments (lower = higher priority)
const segmentSortOrder: Record<PerformanceSegment, number> = {
  'Power User': 0,
  'Engaged Developer': 1,
  'Growing User': 2,
  'Early Explorer': 3,
};

export const TopContributorsTable = ({ data, isFiltered = false }: TopContributorsTableProps) => {
  const [showAll, setShowAll] = useState(false);

  // Sorting state: column, and direction ('asc' | 'desc')
  const [sortConfig, setSortConfig] = useState<{ column: SortableColumn; direction: "asc" | "desc" }>({
    column: "segment",
    direction: "asc",
  });

  // Memoize allContributors as before
  const allContributors = useMemo(() => {
    // Filter out aggregated summary rows (those with special email markers)
    const userRows = data.filter(row => !row.Email.includes('active users'));
    
    const userStats = new Map<string, ContributorWithSegment>();
    
    userRows.forEach(row => {
      const email = row.Email;
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      const suggestedLines = parseInt(row['Chat Suggested Lines Added']) || 0;
      const tabsAccepted = parseInt(row['Tabs Accepted']) || 0;
      const editRequests = parseInt(row['Edit Requests']) || 0;
      const askRequests = parseInt(row['Ask Requests']) || 0;
      const agentRequests = parseInt(row['Agent Requests']) || 0;
      const cmdKRequests = parseInt(row['Cmd+K Requests']) || 0;
      
      if (!userStats.has(email)) {
        userStats.set(email, {
          email,
          acceptedLines: 0,
          suggestedLines: 0,
          acceptanceRate: 0,
          chatTotalApplies: 0,
          tabsAccepted: 0,
          editRequests: 0,
          askRequests: 0,
          agentRequests: 0,
          cmdKRequests: 0,
          segment: 'Early Explorer',
        });
      }
      
      const stats = userStats.get(email)!;
      stats.acceptedLines += acceptedLines;
      stats.suggestedLines += suggestedLines;
      stats.chatTotalApplies += acceptedLines; // Using accepted lines as proxy for total applies
      stats.tabsAccepted += tabsAccepted;
      stats.editRequests += editRequests;
      stats.askRequests += askRequests;
      stats.agentRequests += agentRequests;
      stats.cmdKRequests += cmdKRequests;
    });

    // Calculate acceptance rates and segments
    userStats.forEach(stats => {
      stats.acceptanceRate = stats.suggestedLines > 0 
        ? (stats.acceptedLines / stats.suggestedLines) * 100
        : 0;
      stats.segment = getPerformanceSegment(stats.acceptanceRate, stats.chatTotalApplies);
    });

    return Array.from(userStats.values());
  }, [data]);

  // Sorting logic, memoized for performance
  const sortedContributors = useMemo(() => {
    const sorted = [...allContributors];
    switch (sortConfig.column) {
      case "email":
        sorted.sort((a, b) =>
          sortConfig.direction === "asc"
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email)
        );
        break;
      case "segment":
        sorted.sort((a, b) => {
          const diff = segmentSortOrder[a.segment] - segmentSortOrder[b.segment];
          return sortConfig.direction === "asc" ? diff : -diff;
        });
        break;
      case "acceptedLines":
      case "suggestedLines":
      case "chatTotalApplies":
      case "tabsAccepted":
      case "editRequests":
      case "askRequests":
      case "agentRequests":
      case "cmdKRequests":
        sorted.sort((a, b) =>
          sortConfig.direction === "asc"
            ? a[sortConfig.column] - b[sortConfig.column]
            : b[sortConfig.column] - a[sortConfig.column]
        );
        break;
      case "acceptanceRate":
        sorted.sort((a, b) =>
          sortConfig.direction === "asc"
            ? a.acceptanceRate - b.acceptanceRate
            : b.acceptanceRate - a.acceptanceRate
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [allContributors, sortConfig]);

  // Don't render the table if there's only one user
  if (sortedContributors.length <= 1) {
    return null;
  }

  const displayedContributors = showAll ? sortedContributors : sortedContributors.slice(0, 7);

  // Handle header click to sort columns
  function handleSort(column: SortableColumn) {
    setSortConfig(prev => {
      if (prev.column === column) {
        // Toggle direction
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // Otherwise set new column, default to descending for numbers, ascending for names/segments
      if (column === "email" || column === "segment") {
        return { column, direction: "asc" };
      }
      return { column, direction: "desc" };
    });
  }

  // Simple sort icon
  function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
    return (
      <span className="inline-block w-3 ml-1">
        {active ? (direction === "asc" ? "▲" : "▼") : ""}
      </span>
    );
  }

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
                  <p>Users ranked by performance segment and comprehensive activity metrics.</p>
                  <p className="text-sm text-muted-foreground mt-1">Acceptance Rate = (Accepted Lines / Suggested Lines) × 100</p>
                  <div className="text-sm text-muted-foreground mt-2">
                    <p><strong>Performance Segments:</strong></p>
                    <p>⚡ Power User: Rate {'>'} 40% & Chat Applies {'>'} 200</p>
                    <p>✅ Engaged Developer: Rate {'>'} 25% & Chat Applies {'>'} 50</p>
                    <p>📈 Growing User: Rate {'>'} 15% or Chat Applies {'>'} 10</p>
                    <p>⚠️ Early Explorer: Below thresholds</p>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <p><strong>Metrics include:</strong></p>
                    <p>Chat metrics, Tabs, Edit/Ask/Agent requests, Cmd+K usage</p>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* Each TableHead becomes sortable */}
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('email')}
                  aria-sort={sortConfig.column === 'email' ? sortConfig.direction : undefined}
                >
                  {columnLabels.email}
                  <SortIcon active={sortConfig.column === 'email'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('segment')}
                  aria-sort={sortConfig.column === 'segment' ? sortConfig.direction : undefined}
                >
                  {columnLabels.segment}
                  <SortIcon active={sortConfig.column === 'segment'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('acceptedLines')}
                  aria-sort={sortConfig.column === 'acceptedLines' ? sortConfig.direction : undefined}
                >
                  {columnLabels.acceptedLines}
                  <SortIcon active={sortConfig.column === 'acceptedLines'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('suggestedLines')}
                  aria-sort={sortConfig.column === 'suggestedLines' ? sortConfig.direction : undefined}
                >
                  {columnLabels.suggestedLines}
                  <SortIcon active={sortConfig.column === 'suggestedLines'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('acceptanceRate')}
                  aria-sort={sortConfig.column === 'acceptanceRate' ? sortConfig.direction : undefined}
                >
                  {columnLabels.acceptanceRate}
                  <SortIcon active={sortConfig.column === 'acceptanceRate'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('chatTotalApplies')}
                  aria-sort={sortConfig.column === 'chatTotalApplies' ? sortConfig.direction : undefined}
                >
                  {columnLabels.chatTotalApplies}
                  <SortIcon active={sortConfig.column === 'chatTotalApplies'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('tabsAccepted')}
                  aria-sort={sortConfig.column === 'tabsAccepted' ? sortConfig.direction : undefined}
                >
                  {columnLabels.tabsAccepted}
                  <SortIcon active={sortConfig.column === 'tabsAccepted'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('editRequests')}
                  aria-sort={sortConfig.column === 'editRequests' ? sortConfig.direction : undefined}
                >
                  {columnLabels.editRequests}
                  <SortIcon active={sortConfig.column === 'editRequests'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('askRequests')}
                  aria-sort={sortConfig.column === 'askRequests' ? sortConfig.direction : undefined}
                >
                  {columnLabels.askRequests}
                  <SortIcon active={sortConfig.column === 'askRequests'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('agentRequests')}
                  aria-sort={sortConfig.column === 'agentRequests' ? sortConfig.direction : undefined}
                >
                  {columnLabels.agentRequests}
                  <SortIcon active={sortConfig.column === 'agentRequests'} direction={sortConfig.direction} />
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('cmdKRequests')}
                  aria-sort={sortConfig.column === 'cmdKRequests' ? sortConfig.direction : undefined}
                >
                  {columnLabels.cmdKRequests}
                  <SortIcon active={sortConfig.column === 'cmdKRequests'} direction={sortConfig.direction} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedContributors.map((contributor) => (
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
                  <TableCell className="text-right">{contributor.chatTotalApplies.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{contributor.tabsAccepted.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{contributor.editRequests.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{contributor.askRequests.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{contributor.agentRequests.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{contributor.cmdKRequests.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Note: This file is quite large (over 250 lines) and should be considered for refactoring into smaller files and isolated components like SortableTableHead, etc.
