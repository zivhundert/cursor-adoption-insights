
import { Rocket, Sparkles, TrendingUp, Sprout } from 'lucide-react';
import { PerformanceSegment } from './types';

// Updated with new clean names: Champion, Producer, Explorer, Starter
export const getPerformanceSegment = (acceptanceRate: number, chatTotalApplies: number, userROI: number): PerformanceSegment => {
  if (acceptanceRate > 40 && chatTotalApplies > 200 && userROI > 100) return 'Champion';
  if (acceptanceRate > 25 && chatTotalApplies > 50 && userROI > 70) return 'Producer';
  if (acceptanceRate > 15 || chatTotalApplies > 10 || userROI > 25) return 'Explorer';
  return 'Starter';
};

export const getSegmentIcon = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Champion':
      return <Rocket className="h-4 w-4 text-blue-600" />;
    case 'Producer':
      return <Sparkles className="h-4 w-4 text-green-500" />;
    case 'Explorer':
      return <TrendingUp className="h-4 w-4 text-orange-500" />;
    case 'Starter':
      return <Sprout className="h-4 w-4 text-lime-700" />;
  }
};

// Motivational badge colors
export const getSegmentBadgeStyle = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Champion':
      return 'bg-blue-200/70 text-blue-800 border-blue-300/50';
    case 'Producer':
      return 'bg-green-200/70 text-green-800 border-green-300/50';
    case 'Explorer':
      return 'bg-orange-200/70 text-orange-800 border-orange-300/50';
    case 'Starter':
      return 'bg-lime-50 text-lime-700 border-lime-300/50';
  }
};

export const getSegmentDescription = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'Champion':
      return 'Top-tier adopter: You lead by example, consistently leveraging AI features and producing incredible value!';
    case 'Producer':
      return 'Active and effective: You regularly use AI tools to drive efficiency and growth in your daily work.';
    case 'Explorer':
      return 'On your way: You’re exploring new tools, building skills, and increasing your impact with every use.';
    case 'Starter':
      return 'Just getting started: Try more features to unlock your productivity potential and join the journey!';
  }
};
