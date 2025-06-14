
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { TopContributorsTableProps, columnLabels } from './types';
import { useContributorData } from './dataProcessing';
import { useSortedContributors } from './sorting';
import { useTableSorting, useDisplaySettings } from './hooks';
import { SortableTableHead } from './components/SortableTableHead';
import { ContributorRow } from './components/ContributorRow';

export const TopContributorsTable = ({ data, isFiltered = false }: TopContributorsTableProps) => {
  const { showAll, toggleShowAll } = useDisplaySettings();
  const { sortConfig, handleSort } = useTableSorting();
  
  const allContributors = useContributorData(data);
  const sortedContributors = useSortedContributors(allContributors, sortConfig);

  if (sortedContributors.length <= 1) {
    return null;
  }

  const displayedContributors = showAll ? sortedContributors : sortedContributors.slice(0, 7);

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
                    <p>Chat metrics, Tabs, Edit/Ask/Agent requests</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {!isFiltered && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleShowAll}
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
                <SortableTableHead column="email" label={columnLabels.email} sortConfig={sortConfig} onSort={handleSort} />
                <SortableTableHead column="segment" label={columnLabels.segment} sortConfig={sortConfig} onSort={handleSort} />
                <SortableTableHead column="acceptedLines" label={columnLabels.acceptedLines} sortConfig={sortConfig} onSort={handleSort} className="text-right" />
                <SortableTableHead column="suggestedLines" label={columnLabels.suggestedLines} sortConfig={sortConfig} onSort={handleSort} className="text-right" />
                <SortableTableHead column="acceptanceRate" label={columnLabels.acceptanceRate} sortConfig={sortConfig} onSort={handleSort} className="text-right" />
                <SortableTableHead column="chatTotalApplies" label={columnLabels.chatTotalApplies} sortConfig={sortConfig} onSort={handleSort} className="text-right" />
                <SortableTableHead column="tabsAccepted" label={columnLabels.tabsAccepted} sortConfig={sortConfig} onSort={handleSort} className="text-right" />
                <SortableTableHead column="editRequests" label={columnLabels.editRequests} sortConfig={sortConfig} onSort={handleSort} className="text-right" />
                <SortableTableHead column="askRequests" label={columnLabels.askRequests} sortConfig={sortConfig} onSort={handleSort} className="text-right" />
                <SortableTableHead column="agentRequests" label={columnLabels.agentRequests} sortConfig={sortConfig} onSort={handleSort} className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedContributors.map((contributor) => (
                <ContributorRow key={contributor.email} contributor={contributor} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
