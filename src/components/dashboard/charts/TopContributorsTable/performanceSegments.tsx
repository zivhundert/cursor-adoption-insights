
import { Rocket, Sparkles, TrendingUp, Sprout } from 'lucide-react';
import { PerformanceSegment } from './types';

// New Segments (motivational names, icons only outside badge text)
export const getPerformanceSegment = (acceptanceRate: number, chatTotalApplies: number, userROI: number): PerformanceSegment => {
  if (acceptanceRate > 40 && chatTotalApplies > 200 && userROI > 100) return 'AI Champion';
  if (acceptanceRate > 25 && chatTotalApplies > 50 && userROI > 70) return 'Productive Developer';
  if (acceptanceRate > 15 || chatTotalApplies > 10 || userROI > 25) return 'Learning & Growing';
  return 'Getting Started';
};

export const getSegmentIcon = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'AI Champion':
      return <Rocket className="h-4 w-4 text-blue-600" />;
    case 'Productive Developer':
      return <Sparkles className="h-4 w-4 text-green-500" />;
    case 'Learning & Growing':
      return <TrendingUp className="h-4 w-4 text-orange-500" />;
    case 'Getting Started':
      return <Sprout className="h-4 w-4 text-lime-700" />;
  }
};

// Style (improved motivational colors)
export const getSegmentBadgeStyle = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'AI Champion':
      return 'bg-blue-200/70 text-blue-800 border-blue-300/50';
    case 'Productive Developer':
      return 'bg-green-200/70 text-green-800 border-green-300/50';
    case 'Learning & Growing':
      return 'bg-orange-200/70 text-orange-800 border-orange-300/50';
    case 'Getting Started':
      return 'bg-lime-50 text-lime-700 border-lime-300/50';
  }
};

export const getSegmentDescription = (segment: PerformanceSegment) => {
  switch (segment) {
    case 'AI Champion':
      return 'Leadership in AI adoption! You consistently accept AI suggestions, use them heavily, and deliver great ROI for your organization.';
    case 'Productive Developer':
      return 'Strong adoption: you make regular use of AI and drive measurable improvements in productivity and savings.';
    case 'Learning & Growing':
      return 'You’re actively exploring AI tools, learning new features, and showing positive engagement. Keep growing!';
    case 'Getting Started':
      return 'Early stages: try more AI features to boost your productivity and join your teammates on the path to AI mastery.';
  }
};
