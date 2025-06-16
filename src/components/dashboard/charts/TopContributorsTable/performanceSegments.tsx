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

export const getSegmentCalculationExplanation = (
  segment: PerformanceSegment,
  acceptanceRate: number,
  chatTotalApplies: number,
  userROI: number
): string => {
  const formatCriteria = (value: number, threshold: number, unit: string = '', isPercent: boolean = false) => {
    const formattedValue = isPercent ? `${value.toFixed(1)}%` : value.toLocaleString() + unit;
    const formattedThreshold = isPercent ? `${threshold}%` : threshold.toLocaleString() + unit;
    const icon = value > threshold ? '✓' : '✗';
    return `${formattedValue} > ${formattedThreshold} ${icon}`;
  };

  const acceptanceCriteria = formatCriteria(acceptanceRate, getThresholdForSegment(segment, 'acceptance'), '', true);
  const chatCriteria = formatCriteria(chatTotalApplies, getThresholdForSegment(segment, 'chat'));
  const roiCriteria = formatCriteria(userROI, getThresholdForSegment(segment, 'roi'), '', true);

  switch (segment) {
    case 'Champion':
      return `Champion Calculation:\n• Acceptance Rate: ${acceptanceCriteria}\n• Chat Total Applies: ${chatCriteria}\n• User ROI: ${roiCriteria}\n\nAll criteria met for Champion status!`;
    case 'Producer':
      return `Producer Calculation:\n• Acceptance Rate: ${acceptanceCriteria}\n• Chat Total Applies: ${chatCriteria}\n• User ROI: ${roiCriteria}\n\nMeets Producer-level criteria.`;
    case 'Explorer':
      return `Explorer Calculation:\n• Acceptance Rate: ${acceptanceCriteria}\n• Chat Total Applies: ${chatCriteria}\n• User ROI: ${roiCriteria}\n\nMeets at least one Explorer criterion.`;
    case 'Starter':
      return `Starter Calculation:\n• Acceptance Rate: ${acceptanceCriteria}\n• Chat Total Applies: ${chatCriteria}\n• User ROI: ${roiCriteria}\n\nJust getting started - try more features!`;
  }
};

const getThresholdForSegment = (segment: PerformanceSegment, type: 'acceptance' | 'chat' | 'roi'): number => {
  switch (segment) {
    case 'Champion':
      return type === 'acceptance' ? 40 : type === 'chat' ? 200 : 100;
    case 'Producer':
      return type === 'acceptance' ? 25 : type === 'chat' ? 50 : 70;
    case 'Explorer':
      return type === 'acceptance' ? 15 : type === 'chat' ? 10 : 25;
    case 'Starter':
      return type === 'acceptance' ? 0 : type === 'chat' ? 0 : 0;
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
