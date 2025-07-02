
import { CursorDataRow } from '@/pages/Index';

interface CalculatedMetrics {
  totalAcceptedLines: string;
  activeUsers: number;
  acceptanceRate: string;
  estimatedHoursSaved: string;
  estimatedMoneySaved: string;
  roi: string;
  debug: {
    totalAcceptedLinesRaw: number;
    estimatedHoursSavedRaw: number;
    estimatedMoneySavedRaw: number;
    annualCursorCost: number;
    roiRaw: number;
  };
}

interface MetricsSettings {
  linesPerMinute: number;
  pricePerHour: number;
  cursorPricePerUser: number;
}

export const calculateMetrics = (
  data: CursorDataRow[],
  baseFilteredData: CursorDataRow[],
  settings: MetricsSettings
): CalculatedMetrics => {
  // Use baseFilteredData for totals (respects user/date filters but not time period)
  const totalAcceptedLines = baseFilteredData.reduce((sum, row) => {
    // Skip aggregated rows
    if (row.Email.includes('active users')) return sum;
    return sum + (parseInt(row['Chat Accepted Lines Added']) || 0);
  }, 0);

  const activeUsers = new Set(
    baseFilteredData
      .filter(row => !row.Email.includes('active users')) // Skip aggregated rows
      .filter(row => row['Is Active'].toLowerCase() === 'true')
      .map(row => row.Email)
  ).size;

  // Calculate acceptance rate from filtered data (should be affected by time period)
  const filteredAcceptedLines = data.reduce((sum, row) => {
    return sum + (parseInt(row['Chat Accepted Lines Added']) || 0);
  }, 0);

  const filteredSuggestedLines = data.reduce((sum, row) => {
    return sum + (parseInt(row['Chat Suggested Lines Added']) || 0);
  }, 0);

  const acceptanceRate = filteredSuggestedLines > 0 
    ? ((filteredAcceptedLines / filteredSuggestedLines) * 100).toFixed(1)
    : '0';

  // Estimate dev hours saved (dynamic lines per minute)
  const estimatedHoursSaved = Math.round(totalAcceptedLines / (settings.linesPerMinute * 60));

  // Calculate money saved
  const estimatedMoneySaved = estimatedHoursSaved * settings.pricePerHour;

  // Calculate annual Cursor cost
  const annualCursorCost = activeUsers * settings.cursorPricePerUser * 12;

  // Calculate ROI as a percentage
  const roi = annualCursorCost > 0 
    ? ((estimatedMoneySaved / annualCursorCost) * 100).toFixed(1)
    : '0';

  return {
    totalAcceptedLines: totalAcceptedLines.toLocaleString(),
    activeUsers,
    acceptanceRate: `${acceptanceRate}%`,
    estimatedHoursSaved: estimatedHoursSaved.toLocaleString(),
    estimatedMoneySaved: `$${estimatedMoneySaved.toLocaleString()}`,
    roi: `${roi}%`,
    debug: {
      totalAcceptedLinesRaw: totalAcceptedLines,
      estimatedHoursSavedRaw: estimatedHoursSaved,
      estimatedMoneySavedRaw: estimatedMoneySaved,
      annualCursorCost,
      roiRaw: parseFloat(roi),
    },
  };
};
