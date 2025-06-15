
import { useState } from 'react';
import { Users, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface UserSelectorProps {
  users: string[];
  selectedUsers: string[];
  onChange: (selectedUsers: string[]) => void;
}

export const UserSelector = ({ users, selectedUsers, onChange }: UserSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUserToggle = (user: string) => {
    if (user === 'all') {
      onChange([]);
    } else {
      onChange(
        selectedUsers.includes(user)
          ? selectedUsers.filter(u => u !== user)
          : [...selectedUsers, user]
      );
    }
  };

  const handleSelectAllUsers = () => {
    onChange([...users]);
  };

  const handleClearAllUsers = () => {
    onChange([]);
  };

  const getUserDisplayText = () => {
    if (selectedUsers.length === 0) return 'All Users';
    if (selectedUsers.length === 1) return selectedUsers[0];
    if (selectedUsers.length <= 3) return selectedUsers.join(', ');
    return `${selectedUsers.slice(0, 2).join(', ')}, +${selectedUsers.length - 2} more`;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Users {selectedUsers.length > 0 && `(${selectedUsers.length} selected)`}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
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

              {users.map(user => (
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
  );
};
