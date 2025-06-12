
import { startOfWeek, startOfMonth, format } from 'date-fns';
import { CursorDataRow } from '@/pages/Index';

export type AggregationPeriod = 'day' | 'week' | 'month';

export const aggregateDataByPeriod = (data: CursorDataRow[], period: AggregationPeriod): CursorDataRow[] => {
  if (period === 'day') {
    return data; // No aggregation needed for daily view
  }

  const aggregatedMap = new Map<string, {
    date: string;
    users: CursorDataRow[];
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
    applyExtensions: Map<string, number>;
    tabExtensions: Map<string, number>;
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
        users: [],
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
        applyExtensions: new Map(),
        tabExtensions: new Map(),
        activeUsers: new Set(),
      });
    }

    const agg = aggregatedMap.get(periodKey)!;
    
    // Store all user records for this period
    agg.users.push(row);
    
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

    // Collect unique active users
    if (row['Is Active'].toLowerCase() === 'true') {
      agg.activeUsers.add(row.Email);
    }

    // Count model usage
    const model = row['Most Used Model'];
    if (model && model.trim()) {
      agg.models.set(model, (agg.models.get(model) || 0) + 1);
    }

    // Count apply extensions
    const applyExt = row['Most Used Apply Extension'];
    if (applyExt && applyExt.trim() && applyExt !== 'Unknown' && applyExt !== '') {
      agg.applyExtensions.set(applyExt, (agg.applyExtensions.get(applyExt) || 0) + 1);
    }

    // Count tab extensions
    const tabExt = row['Most Used Tab Extension'];
    if (tabExt && tabExt.trim() && tabExt !== 'Unknown' && tabExt !== '') {
      agg.tabExtensions.set(tabExt, (agg.tabExtensions.get(tabExt) || 0) + 1);
    }
  });

  // Convert aggregated data back to CursorDataRow format
  const result: CursorDataRow[] = [];
  
  Array.from(aggregatedMap.values()).forEach(agg => {
    const mostUsedModel = Array.from(agg.models.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    const mostUsedApplyExt = Array.from(agg.applyExtensions.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    const mostUsedTabExt = Array.from(agg.tabExtensions.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    // Add the aggregated row for time-series charts
    result.push({
      Date: agg.date,
      Email: `${agg.activeUsers.size} active users`, // Special marker for aggregated data
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
      'Most Used Apply Extension': mostUsedApplyExt,
      'Most Used Tab Extension': mostUsedTabExt,
    } as CursorDataRow);

    // Add all individual user records for components that need them
    agg.users.forEach(userRow => {
      result.push({
        ...userRow,
        Date: agg.date, // Update date to the period start
      });
    });
  });

  return result.sort((a, b) => a.Date.localeCompare(b.Date));
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
