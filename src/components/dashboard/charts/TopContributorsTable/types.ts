
import { CursorDataRow } from '@/pages/Index';

// UPDATED: Use new, business-friendly, motivational segment names.
export type PerformanceSegment = 
  | 'AI Champion 🚀'
  | 'Productive Developer ✨'
  | 'Learning & Growing 📈'
  | 'Getting Started 🌱';

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
  'AI Champion 🚀': 0,
  'Productive Developer ✨': 1,
  'Learning & Growing 📈': 2,
  'Getting Started 🌱': 3,
};
