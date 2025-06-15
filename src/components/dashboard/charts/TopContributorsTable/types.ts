
import { CursorDataRow } from '@/pages/Index';

// Badge levels: Champion, Producer, Explorer, Starter (no "AI" prefix)
export type PerformanceSegment =
  | 'Champion'
  | 'Producer'
  | 'Explorer'
  | 'Starter';

export interface ContributorWithSegment {
  email: string;
  acceptedLines: number;
  suggestedLines: number;
  acceptanceRate: number;
  chatTotalApplies: number;
  tabsAccepted: number;
  editRequests: number;
  askRequests: number;
  agentRequests: number;
  userROI: number;
  segment: PerformanceSegment;
}

export type SortableColumn =
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
  | "userROI";

export interface TopContributorsTableProps {
  data: CursorDataRow[];
  isFiltered?: boolean;
}

export const columnLabels: Record<SortableColumn, string> = {
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
  userROI: "User ROI",
};

export const segmentSortOrder: Record<PerformanceSegment, number> = {
  'Champion': 0,
  'Producer': 1,
  'Explorer': 2,
  'Starter': 3,
};
