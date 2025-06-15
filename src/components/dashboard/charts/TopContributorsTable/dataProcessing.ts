import { useMemo } from 'react';
import { CursorDataRow } from '@/pages/Index';
import { ContributorWithSegment } from './types';
import { getPerformanceSegment } from './performanceSegments';

export const useContributorData = (data: CursorDataRow[], linesPerMinute: number, pricePerHour: number, cursorPricePerUser: number) => {
  return useMemo(() => {
    const userRows = data.filter(row => !row.Email.includes('active users'));
    const userStats = new Map<string, ContributorWithSegment>();
    
    userRows.forEach(row => {
      const email = row.Email;
      const acceptedLines = parseInt(row['Chat Accepted Lines Added']) || 0;
      const suggestedLines = parseInt(row['Chat Suggested Lines Added']) || 0;
      const tabsAccepted = parseInt(row['Tabs Accepted']) || 0;
      const editRequests = parseInt(row['Edit Requests']) || 0;
      const askRequests = parseInt(row['Ask Requests']) || 0;
      const agentRequests = parseInt(row['Agent Requests']) || 0;
      
      if (!userStats.has(email)) {
        userStats.set(email, {
          email,
          acceptedLines: 0,
          suggestedLines: 0,
          acceptanceRate: 0,
          chatTotalApplies: 0,
          tabsAccepted: 0,
          editRequests: 0,
          askRequests: 0,
          agentRequests: 0,
          userROI: 0,
          segment: 'AI Starter', // default to new Option 2
        });
      }
      
      const stats = userStats.get(email)!;
      stats.acceptedLines += acceptedLines;
      stats.suggestedLines += suggestedLines;
      stats.chatTotalApplies += acceptedLines;
      stats.tabsAccepted += tabsAccepted;
      stats.editRequests += editRequests;
      stats.askRequests += askRequests;
      stats.agentRequests += agentRequests;
    });
    
    userStats.forEach(stats => {
      stats.acceptanceRate = stats.suggestedLines > 0
        ? (stats.acceptedLines / stats.suggestedLines) * 100
        : 0;
      
      // Calculate User ROI first
      const estimatedHoursSaved = stats.acceptedLines / (linesPerMinute * 60);
      const individualMoneySaved = estimatedHoursSaved * pricePerHour;
      const annualCursorCostPerUser = cursorPricePerUser * 12;
      
      stats.userROI = annualCursorCostPerUser > 0 
        ? (individualMoneySaved / annualCursorCostPerUser) * 100
        : 0;
      
      // Then determine segment using ROI
      stats.segment = getPerformanceSegment(stats.acceptanceRate, stats.chatTotalApplies, stats.userROI);
    });
    
    return Array.from(userStats.values());
  }, [data, linesPerMinute, pricePerHour, cursorPricePerUser]);
};
