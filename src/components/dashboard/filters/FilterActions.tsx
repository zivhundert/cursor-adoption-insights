
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  onApply: () => void;
  onClear: () => void;
}

export const FilterActions = ({ onApply, onClear }: FilterActionsProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Actions</label>
      <div className="flex gap-2">
        <Button onClick={onApply} className="flex-1">
          Apply
        </Button>
        <Button onClick={onClear} variant="outline" className="flex-1">
          Clear
        </Button>
      </div>
    </div>
  );
};
