
import { useState } from 'react';
import { Calendar, CalendarRange, Users, Filter, BarChart3, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CursorDataRow } from '@/pages/Index';
import type { DateRange } from 'react-day-picker';
import type { AggregationPeriod } from '@/utils/dataAggregation';

interface DashboardFiltersProps {
  data: CursorDataRow[];
  onFiltersChange: (filters: {
    dateRange: { from?: Date; to?: Date };
    selectedUsers: string[];
    selectedModel: string;
    aggregationPeriod: AggregationPeriod;
  }) => void;
}

export const DashboardFilters = ({ data, onFiltersChange }: DashboardFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [aggregationPeriod, setAggregationPeriod] = useState<AggregationPeriod>('day');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const uniqueUsers = Array.from(new Set(data.map(row => row.Email))).sort();
  const uniqueModels = Array.from(new Set(data.map(row => row['Most Used Model']).filter(Boolean))).sort();

  const handleUserToggle = (user: string) => {
    if (user === 'all') {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(prev => 
        prev.includes(user) 
          ? prev.filter(u => u !== user)
          : [...prev, user]
      );
    }
  };

  const handleSelectAllUsers = () => {
    setSelectedUsers([...uniqueUsers]);
  };

  const handleClearAllUsers = () => {
    setSelectedUsers([]);
  };

  const getUserDisplayText = () => {
    if (selectedUsers.length === 0) return 'All Users';
    if (selectedUsers.length === 1) return selectedUsers[0];
    if (selectedUsers.length <= 3) return selectedUsers.join(', ');
    return `${selectedUsers.slice(0, 2).join(', ')}, +${selectedUsers.length - 2} more`;
  };

  const handleFilterChange = () => {
    onFiltersChange({
      dateRange: {
        from: dateRange?.from,
        to: dateRange?.to,
      },
      selectedUsers,
      selectedModel,
      aggregationPeriod,
    });
  };

  const clearFilters = () => {
    setDateRange(undefined);
    setSelectedUsers([]);
    setSelectedModel('all');
    setAggregationPeriod('day');
    onFiltersChange({
      dateRange: {},
      selectedUsers: [],
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

          {/* Multi-User Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Users {selectedUsers.length > 0 && `(${selectedUsers.length} selected)`}
            </label>
            <Popover open={isUserDropdownOpen} onOpenChange={setIsUserDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span className="truncate">{getUserDisplayText()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="p-4 space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSelectAllUsers}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Select All
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleClearAllUsers}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                      <Checkbox
                        id="all-users"
                        checked={selectedUsers.length === 0}
                        onCheckedChange={() => handleUserToggle('all')}
                      />
                      <label htmlFor="all-users" className="text-sm font-medium cursor-pointer">
                        All Users
                      </label>
                    </div>
                    
                    {uniqueUsers.map(user => (
                      <div key={user} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                        <Checkbox
                          id={user}
                          checked={selectedUsers.includes(user)}
                          onCheckedChange={() => handleUserToggle(user)}
                        />
                        <label htmlFor={user} className="text-sm cursor-pointer truncate">
                          {user}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {selectedUsers.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="text-sm font-medium mb-2">Selected Users:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedUsers.map(user => (
                          <Badge 
                            key={user} 
                            variant="secondary" 
                            className="text-xs cursor-pointer"
                            onClick={() => handleUserToggle(user)}
                          >
                            {user}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
