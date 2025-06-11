
import { startOfWeek, startOfMonth, format } from 'date-fns';
import { CursorDataRow } from '@/pages/Index';

export type AggregationPeriod = 'day' | 'week' | 'month';

export const aggregateDataByPeriod = (data: CursorDataRow[], period: AggregationPeriod): CursorDataRow[] => {
  if (period === 'day') {
    return data; // No aggregation needed for daily view
  }

  const aggregatedMap = new Map<string, {
    date: string;
    emails: Set<string>;
    askRequests: number;
    editRequests: number;
    agentRequests: number;
    bugbotRequests: number;
    cmdKRequests: number;
    apiRequests: number;
    suggestedLines: number;
    acceptedLines: number;
    tabsAccepted: number;
    models: Map<string, number>;
    activeUsers: Set<string>;
  }>();

  data.forEach(row => {
    const date = new Date(row.Date);
    let periodKey: string;
    
    if (period === 'week') {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
      periodKey = format(weekStart, 'yyyy-MM-dd');
    } else {
      const monthStart = startOfMonth(date);
      periodKey = format(monthStart, 'yyyy-MM-dd');
    }

    if (!aggregatedMap.has(periodKey)) {
      aggregatedMap.set(periodKey, {
        date: periodKey,
        emails: new Set(),
        askRequests: 0,
        editRequests: 0,
        agentRequests: 0,
        bugbotRequests: 0,
        cmdKRequests: 0,
        apiRequests: 0,
        suggestedLines: 0,
        acceptedLines: 0,
        tabsAccepted: 0,
        models: new Map(),
        activeUsers: new Set(),
      });
    }

    const agg = aggregatedMap.get(periodKey)!;
    
    // Aggregate numeric values
    agg.askRequests += parseInt(row['Ask Requests']) || 0;
    agg.editRequests += parseInt(row['Edit Requests']) || 0;
    agg.agentRequests += parseInt(row['Agent Requests']) || 0;
    agg.bugbotRequests += parseInt(row['Bugbot Requests']) || 0;
    agg.cmdKRequests += parseInt(row['Cmd+K Requests']) || 0;
    agg.apiRequests += parseInt(row['API Requests']) || 0;
    agg.suggestedLines += parseInt(row['Chat Suggested Lines Added']) || 0;
    agg.acceptedLines += parseInt(row['Chat Accepted Lines Added']) || 0;
    agg.tabsAccepted += parseInt(row['Tabs Accepted']) || 0;

    // Collect unique users
    agg.emails.add(row.Email);
    if (row['Is Active'].toLowerCase() === 'true') {
      agg.activeUsers.add(row.Email);
    }

    // Count model usage
    const model = row['Most Used Model'];
    if (model) {
      agg.models.set(model, (agg.models.get(model) || 0) + 1);
    }
  });

  // Convert aggregated data back to CursorDataRow format
  return Array.from(aggregatedMap.values()).map(agg => {
    const mostUsedModel = Array.from(agg.models.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    return {
      Date: agg.date,
      Email: Array.from(agg.emails)[0] || '', // Use first email as representative
      'User ID': '',
      'Is Active': agg.activeUsers.size > 0 ? 'true' : 'false',
      'Ask Requests': agg.askRequests.toString(),
      'Edit Requests': agg.editRequests.toString(),
      'Agent Requests': agg.agentRequests.toString(),
      'Bugbot Requests': agg.bugbotRequests.toString(),
      'Cmd+K Requests': agg.cmdKRequests.toString(),
      'API Requests': agg.apiRequests.toString(),
      'Chat Suggested Lines Added': agg.suggestedLines.toString(),
      'Chat Accepted Lines Added': agg.acceptedLines.toString(),
      'Tabs Accepted': agg.tabsAccepted.toString(),
      'Most Used Model': mostUsedModel,
      'Most Used Apply Extension': '',
      'Most Used Tab Extension': '',
    } as CursorDataRow;
  }).sort((a, b) => a.Date.localeCompare(b.Date));
};

export const formatPeriodLabel = (date: string, period: AggregationPeriod): string => {
  const dateObj = new Date(date);
  
  switch (period) {
    case 'day':
      return format(dateObj, 'MMM dd');
    case 'week':
      return format(dateObj, "'Week' w, yyyy");
    case 'month':
      return format(dateObj, 'MMM yyyy');
    default:
      return format(dateObj, 'MMM dd');
  }
};
