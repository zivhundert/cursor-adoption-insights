import { CursorDataRow } from '@/pages/Index';

export interface ParseResult {
  data: CursorDataRow[];
  error?: string;
}

export const parseCSVFile = async (file: File): Promise<ParseResult> => {
  try {
    const text = await file.text();
    const rows = text.split('\n');
    
    if (rows.length < 2) {
      return { data: [], error: 'CSV file must contain headers and at least one data row' };
    }

    const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const parsedData: CursorDataRow[] = rows.slice(1)
      .filter(row => row.trim())
      .map(row => {
        const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });
        return rowData as CursorDataRow;
      })
      .filter(row => row['Is Active'].toLowerCase() === 'true');

    return { data: parsedData };
  } catch (error) {
    return { data: [], error: 'Failed to parse CSV file. Please check the format and try again.' };
  }
};

export const validateCSVHeaders = (headers: string[]): boolean => {
  const requiredHeaders = [
    'Date', 'User ID', 'Email', 'Is Active', 
    'Chat Suggested Lines Added', 'Chat Suggested Lines Deleted',
    'Chat Accepted Lines Added', 'Chat Accepted Lines Deleted',
    'Chat Total Applies', 'Chat Total Accepts', 'Chat Total Rejects',
    'Chat Tabs Shown', 'Tabs Accepted', 'Edit Requests', 'Ask Requests',
    'Agent Requests', 'Cmd+K Usages', 'Subscription Included Reqs',
    'API Key Reqs', 'Usage Based Reqs', 'Bugbot Usages',
    'Most Used Model', 'Most Used Apply Extension', 'Most Used Tab Extension',
    'Client Version'
  ];
  
  return requiredHeaders.every(required => headers.includes(required));
};
