import { CursorDataRow } from '@/pages/Index';

// Option 2: Consistent, motivational, AI-focused names.
export type PerformanceSegment =
  | 'AI Champion'
  | 'AI Producer'
  | 'AI Explorer'
  | 'AI Starter';

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
  'AI Champion': 0,
  'AI Producer': 1,
  'AI Explorer': 2,
  'AI Starter': 3,
};
