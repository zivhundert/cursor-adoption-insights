
import { BarChart3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AggregationPeriod } from '@/utils/dataAggregation';

interface AggregationPeriodSelectorProps {
  value: AggregationPeriod;
  onChange: (value: AggregationPeriod) => void;
}

export const AggregationPeriodSelector = ({ value, onChange }: AggregationPeriodSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Time Period</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <BarChart3 className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Daily</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
