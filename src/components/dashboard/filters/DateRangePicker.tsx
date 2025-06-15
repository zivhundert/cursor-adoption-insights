
import { useState } from 'react';
import { CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isValid, compareAsc } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import type { CursorDataRow } from '@/pages/Index';

interface DateRangePickerProps {
  data: CursorDataRow[];
  value: DateRange | undefined;
  onChange: (dateRange: DateRange | undefined) => void;
}

function extractDateRange(data: CursorDataRow[]) {
  const validDates = data
    .map(row => {
      const date = new Date(row.Date);
      return isValid(date) ? date : null;
    })
    .filter(Boolean) as Date[];

  if (validDates.length === 0) return { minDate: undefined, maxDate: undefined };
  validDates.sort(compareAsc);
  return { minDate: validDates[0], maxDate: validDates[validDates.length - 1] };
}

function toDateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export const DateRangePicker = ({ data, value, onChange }: DateRangePickerProps) => {
  const { minDate, maxDate } = extractDateRange(data);

  const dataRangeLabel =
    minDate && maxDate
      ? `${format(minDate, "LLL dd, yyyy")} to ${format(maxDate, "LLL dd, yyyy")}`
      : "No data dates available";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Date Range</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value?.from && "text-muted-foreground"
            )}
            disabled={!minDate || !maxDate}
          >
            <CalendarRange className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div>
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={minDate}
              selected={value}
              onSelect={onChange}
              numberOfMonths={2}
              className="pointer-events-auto"
              disabled={date =>
                !minDate ||
                !maxDate ||
                toDateOnly(date) < toDateOnly(minDate) ||
                toDateOnly(date) > toDateOnly(maxDate)
              }
            />
            <div className="text-xs text-muted-foreground p-2 pt-0">
              {minDate && maxDate && (
                <span>
                  Data available between <b>{dataRangeLabel}</b>
                </span>
              )}
              {(!minDate || !maxDate) && (
                <span>No data dates available.</span>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
