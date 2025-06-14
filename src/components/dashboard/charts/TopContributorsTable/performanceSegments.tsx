
import { Zap, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { PerformanceSegment } from './types';

export const getPerformanceSegment = (acceptanceRate: number, chatTotalApplies: number): PerformanceSegment => {
  if (acceptanceRate > 40 && chatTotalApplies > 200) return 'Power User';
  if (acceptanceRate > 25 && chatTotalApplies > 50) return 'Engaged Developer';
  if (acceptanceRate > 15 || chatTotalApplies > 10) return 'Growing User';
  return 'Early Explorer';
};

export const getSegmentIcon = (segment: PerformanceSegment) => {
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

export const getSegmentBadgeStyle = (segment: PerformanceSegment) => {
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

export const getSegmentDescription = (segment: PerformanceSegment) => {
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
