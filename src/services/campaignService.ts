
import { CursorDataRow } from '@/pages/Index';
import { AggregationPeriod } from '@/utils/dataAggregation';

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  data: CursorDataRow[];
  lastFilters?: {
    dateRange: { from?: Date; to?: Date };
    selectedUser: string;
    selectedModel: string;
    aggregationPeriod: AggregationPeriod;
  };
  metadata: {
    totalRows: number;
    dateRange: { start: string; end: string };
    uniqueUsers: number;
  };
}

const STORAGE_KEY = 'cursor_campaigns';

export const campaignService = {
  getAllCampaigns(): Campaign[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading campaigns:', error);
      return [];
    }
  },

  saveCampaign(campaign: Campaign): void {
    try {
      const campaigns = this.getAllCampaigns();
      const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
      
      if (existingIndex >= 0) {
        campaigns[existingIndex] = { ...campaign, lastModified: new Date().toISOString() };
      } else {
        campaigns.push(campaign);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.error('Error saving campaign:', error);
      throw new Error('Failed to save campaign');
    }
  },

  deleteCampaign(id: string): void {
    try {
      const campaigns = this.getAllCampaigns().filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw new Error('Failed to delete campaign');
    }
  },

  generateCampaignMetadata(data: CursorDataRow[]) {
    const dates = data.map(row => new Date(row.Date)).filter(date => !isNaN(date.getTime()));
    const uniqueUsers = new Set(data.map(row => row.Email)).size;
    
    return {
      totalRows: data.length,
      dateRange: {
        start: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))).toISOString() : '',
        end: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))).toISOString() : '',
      },
      uniqueUsers,
    };
  },

  createCampaign(name: string, data: CursorDataRow[]): Campaign {
    const id = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    return {
      id,
      name,
      createdAt: now,
      lastModified: now,
      data,
      metadata: this.generateCampaignMetadata(data),
    };
  },
};
