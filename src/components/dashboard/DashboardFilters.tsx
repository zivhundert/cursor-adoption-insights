
import { useState } from 'react';
import { Calendar, CalendarRange, User, Filter, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CursorDataRow } from '@/pages/Index';
import type { DateRange } from 'react-day-picker';
import type { AggregationPeriod } from '@/utils/dataAggregation';

interface DashboardFiltersProps {
  data: CursorDataRow[];
  onFiltersChange: (filters: {
    dateRange: { from?: Date; to?: Date };
    selectedUser: string;
    selectedModel: string;
    aggregationPeriod: AggregationPeriod;
  }) => void;
}

export const DashboardFilters = ({ data, onFiltersChange }: DashboardFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>('day');

  const uniqueUsers = Array.from(new Set(data.map(row => row.Email))).sort();
  const uniqueModels = Array.from(new Set(data.map(row => row['Most Used Model']).filter(Boolean))).sort();

  const handleFilterChange = () => {
    onFiltersChange({
      dateRange: {
        from: dateRange?.from,
        to: dateRange?.to,
      },
      selectedUser,
      selectedModel,
      aggregationPeriod,
    });
  };

  const clearFilters = () => {
    setDateRange(undefined);
    setSelectedUser('all');
    setSelectedModel('all');
    setAggregationPeriod('day');
    onFiltersChange({
      dateRange: {},
      selectedUser: 'all',
      selectedModel: 'all',
      aggregationPeriod: 'day',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Date Range Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarRange className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Aggregation Period */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={aggregationPeriod} onValueChange={(value: AggregationPeriod) => setAggregationPeriod(value)}>
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

          {/* User Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">User</label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <User className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {uniqueModels.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Actions</label>
            <div className="flex gap-2">
              <Button onClick={handleFilterChange} className="flex-1">
                Apply
              </Button>
              <Button onClick={clearFilters} variant="outline" className="flex-1">
                Clear
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
