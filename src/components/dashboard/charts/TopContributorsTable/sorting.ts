
import { useMemo } from 'react';
import { ContributorWithSegment, SortableColumn, segmentSortOrder } from './types';

export const getAriaSort = (col: SortableColumn, sortConfig: { column: SortableColumn; direction: "asc" | "desc" }) => {
  if (col !== sortConfig.column) return "none";
  return sortConfig.direction === "asc" ? "ascending" : "descending";
};

export const useSortedContributors = (
  contributors: ContributorWithSegment[],
  sortConfig: { column: SortableColumn; direction: "asc" | "desc" }
) => {
  return useMemo(() => {
    const sorted = [...contributors];
    
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
        sorted.sort((a, b) =>
          sortConfig.direction === "asc"
            ? Number(a[sortConfig.column]) - Number(b[sortConfig.column])
            : Number(b[sortConfig.column]) - Number(a[sortConfig.column])
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
  }, [contributors, sortConfig]);
};
