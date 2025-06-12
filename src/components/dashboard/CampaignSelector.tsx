
import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Trash2, Edit2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { campaignService, Campaign } from '@/services/campaignService';
import { CursorDataRow } from '@/pages/Index';

interface CampaignSelectorProps {
  currentCampaign: Campaign | null;
  onCampaignSelect: (campaign: Campaign | null) => void;
  onSaveCampaign: (name: string) => void;
  hasUnsavedData: boolean;
}

export const CampaignSelector = ({ 
  currentCampaign, 
  onCampaignSelect, 
  onSaveCampaign,
  hasUnsavedData 
}: CampaignSelectorProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [showManageDialog, setShowManageDialog] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    const allCampaigns = campaignService.getAllCampaigns();
    setCampaigns(allCampaigns);
  };

  const handleSaveCampaign = () => {
    if (!campaignName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a campaign name",
        variant: "destructive",
      });
      return;
    }

    onSaveCampaign(campaignName.trim());
    setCampaignName('');
    setShowSaveDialog(false);
    loadCampaigns();
    
    toast({
      title: "Campaign saved",
      description: `"${campaignName}" has been saved successfully`,
    });
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    try {
      campaignService.deleteCampaign(campaign.id);
      loadCampaigns();
      
      if (currentCampaign?.id === campaign.id) {
        onCampaignSelect(null);
      }
      
      toast({
        title: "Campaign deleted",
        description: `"${campaign.name}" has been deleted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const duplicatedCampaign = campaignService.createCampaign(
      `${campaign.name} (Copy)`,
      campaign.data
    );
    
    campaignService.saveCampaign(duplicatedCampaign);
    loadCampaigns();
    
    toast({
      title: "Campaign duplicated",
      description: `"${duplicatedCampaign.name}" has been created`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2">
      {campaigns.length > 0 && (
        <Select 
          value={currentCampaign?.id || ''} 
          onValueChange={(value) => {
            const selected = campaigns.find(c => c.id === value);
            onCampaignSelect(selected || null);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No campaign selected</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{campaign.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {campaign.metadata.totalRows} rows • {formatDate(campaign.createdAt)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasUnsavedData && (
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Save Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveCampaign()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCampaign}>Save Campaign</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {campaigns.length > 0 && (
        <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Campaigns</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.metadata.totalRows} rows • {campaign.metadata.uniqueUsers} users
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {formatDate(campaign.createdAt)} • Modified: {formatDate(campaign.lastModified)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDuplicateCampaign(campaign)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCampaign(campaign)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
