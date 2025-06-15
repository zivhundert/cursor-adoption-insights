import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { TopContributorsTableProps, columnLabels } from './types';
import { useContributorData } from './dataProcessing';
import { useSortedContributors } from './sorting';
import { useTableSorting, useDisplaySettings } from './hooks';
import { SortableTableHead } from './components/SortableTableHead';
import { ContributorRow } from './components/ContributorRow';
import { useSettings } from "@/contexts/SettingsContext";

export const TopContributorsTable = ({ data, isFiltered = false }: TopContributorsTableProps) => {
  const { showAll, toggleShowAll } = useDisplaySettings();
  const { sortConfig, handleSort } = useTableSorting();
  const { settings } = useSettings();
  
  const allContributors = useContributorData(
    data, 
    settings.linesPerMinute, 
    settings.pricePerHour, 
    settings.cursorPricePerUser
  );
  const sortedContributors = useSortedContributors(allContributors, sortConfig);

  if (sortedContributors.length < 1) {
    return null;
  }

  const displayedContributors = showAll ? sortedContributors : sortedContributors.slice(0, 7);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold">Adoption Champions</CardTitle>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground hover:scale-110 transition-all cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <p>Users ranked by performance segment and comprehensive activity metrics.</p>
                  <p className="text-sm text-muted-foreground">Acceptance Rate = (Accepted Lines / Suggested Lines) × 100</p>
                  <p className="text-sm text-muted-foreground">User ROI = (Individual Money Saved / Annual Cursor Cost per User) × 100</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Performance Segments:</strong></p>
                    <p>🚀 <span className="font-medium">Champion:</span> Top-tier adopter, leading by example and delivering outstanding value.</p>
                    <p>✨ <span className="font-medium">Producer:</span> Active and effective, regularly using AI to drive efficiency.</p>
                    <p>📈 <span className="font-medium">Explorer:</span> Exploring new tools, growing skills, and boosting your results.</p>
                    <p>🌱 <span className="font-medium">Starter:</span> Just getting started on your productivity journey.</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Metrics include:</strong></p>
                    <p>Chat metrics, Tabs, Edit/Ask/Agent requests, Individual ROI</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead column="email" label={columnLabels.email} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="segment" label={columnLabels.segment} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="acceptedLines" label={columnLabels.acceptedLines} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="suggestedLines" label={columnLabels.suggestedLines} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="acceptanceRate" label={columnLabels.acceptanceRate} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="chatTotalApplies" label={columnLabels.chatTotalApplies} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="tabsAccepted" label={columnLabels.tabsAccepted} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="editRequests" label={columnLabels.editRequests} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="askRequests" label={columnLabels.askRequests} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="agentRequests" label={columnLabels.agentRequests} sortConfig={sortConfig} onSort={handleSort} />
              <SortableTableHead column="userROI" label={columnLabels.userROI} sortConfig={sortConfig} onSort={handleSort} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedContributors.map((contributor) => (
              <ContributorRow key={contributor.email} contributor={contributor} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
