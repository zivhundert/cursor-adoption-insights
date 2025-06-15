
import { Rocket, Sparkles, TrendingUp, Sprout } from 'lucide-react';
import { PerformanceSegment } from './types';

// Option 2: Consistent AI branding (Champion/Producer/Explorer/Starter)
export const getPerformanceSegment = (acceptanceRate: number, chatTotalApplies: number, userROI: number): PerformanceSegment => {
  if (acceptanceRate > 40 && chatTotalApplies > 200 && userROI > 100) return 'AI Champion';
  if (acceptanceRate > 25 && chatTotalApplies > 50 && userROI > 70) return 'AI Producer';
  if (acceptanceRate > 15 || chatTotalApplies > 10 || userROI > 25) return 'AI Explorer';
  return 'AI Starter';
};

export const getSegmentIcon = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'AI Champion':
      return <Rocket className="h-4 w-4 text-blue-600" />;
    case 'AI Producer':
      return <Sparkles className="h-4 w-4 text-green-500" />;
    case 'AI Explorer':
      return <TrendingUp className="h-4 w-4 text-orange-500" />;
    case 'AI Starter':
      return <Sprout className="h-4 w-4 text-lime-700" />;
  }
};

// Motivational badge colors
export const getSegmentBadgeStyle = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'AI Champion':
      return 'bg-blue-200/70 text-blue-800 border-blue-300/50';
    case 'AI Producer':
      return 'bg-green-200/70 text-green-800 border-green-300/50';
    case 'AI Explorer':
      return 'bg-orange-200/70 text-orange-800 border-orange-300/50';
    case 'AI Starter':
      return 'bg-lime-50 text-lime-700 border-lime-300/50';
  }
};

export const getSegmentDescription = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'AI Champion':
      return 'Top-tier AI adopter: You lead by example, consistently leveraging AI features and producing incredible value!';
    case 'AI Producer':
      return 'Active and effective: You regularly use AI tools to drive efficiency and growth in your daily work.';
    case 'AI Explorer':
      return 'On your way: You’re exploring AI, building skills, and increasing your impact with every use.';
    case 'AI Starter':
      return 'Just getting started: Try more AI features to unlock your productivity potential and join the journey!';
  }
};
