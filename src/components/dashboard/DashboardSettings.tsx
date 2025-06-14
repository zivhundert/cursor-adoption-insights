
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/contexts/SettingsContext";

export interface DashboardSettingsSheetProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

interface FormFields {
  linesPerMinute: number;
  theme: "light" | "dark";
  pricePerHour: number;
  cursorPricePerUser: number;
}

export const DashboardSettings: React.FC<DashboardSettingsSheetProps> = ({ open, onOpenChange }) => {
  const { settings, updateSetting, resetDefaults, toggleChartVisibility, showAllCharts, hideAllCharts } = useSettings();
  const { register, handleSubmit, reset, control, formState: { errors, isDirty } } = useForm<FormFields>({
    defaultValues: { 
      linesPerMinute: settings.linesPerMinute, 
      theme: settings.theme,
      pricePerHour: settings.pricePerHour,
      cursorPricePerUser: settings.cursorPricePerUser
    },
    mode: "onBlur",
  });

  // Reset form when sheet opens or settings change
  React.useEffect(() => {
    if (open) {
      reset({ 
        linesPerMinute: settings.linesPerMinute, 
        theme: settings.theme,
        pricePerHour: settings.pricePerHour,
        cursorPricePerUser: settings.cursorPricePerUser
      });
    }
  }, [open, settings.linesPerMinute, settings.theme, settings.pricePerHour, settings.cursorPricePerUser, reset]);

  const onSubmit = (values: FormFields) => {
    updateSetting("linesPerMinute", values.linesPerMinute);
    updateSetting("theme", values.theme);
    updateSetting("pricePerHour", values.pricePerHour);
    updateSetting("cursorPricePerUser", values.cursorPricePerUser);
    onOpenChange(false);
  };

  const chartLabels = {
    cumulativeChart: "Cumulative Usage Chart",
    acceptanceRateChart: "AI Suggestion Acceptance Rate",
    modelUsageChart: "AI Model Usage",
    chatRequestTypesChart: "Chat Request Types",
    averageAskRequestsChart: "Average Ask Requests",
    averageTabsAcceptedChart: "Average Tabs Accepted",
    tabExtensionWordCloud: "Tab Extensions Word Cloud",
    programmingLanguageTreemap: "Programming Language Treemap",
    dayOfWeekChart: "Activity by Day of Week",
    clientVersionChart: "Client Version Usage",
    topContributorsTable: "AI Adoption Champions Table",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[96vw] max-w-md sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize dashboard calculations, preferences, and chart visibility for your team.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-8">
          {/* General Settings Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h3 className="text-lg font-medium mb-4">General Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linesPerMinute">Lines per minute</Label>
                  <Input
                    id="linesPerMinute"
                    type="number"
                    step={1}
                    min={1}
                    max={100}
                    {...register("linesPerMinute", {
                      required: true,
                      valueAsNumber: true,
                      min: 1,
                      max: 100,
                    })}
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground">
                    The average number of code lines your team typically writes per minute (used for calculating hours saved). Default: 10
                  </div>
                  {errors.linesPerMinute && (
                    <div className="text-red-600 text-xs mt-1">Enter a number between 1 and 100.</div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="pricePerHour">Price per hour ($)</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    step={1}
                    min={1}
                    max={500}
                    {...register("pricePerHour", {
                      required: true,
                      valueAsNumber: true,
                      min: 1,
                      max: 500,
                    })}
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground">
                    The hourly rate used for calculating money saved (in USD). Default: $55
                  </div>
                  {errors.pricePerHour && (
                    <div className="text-red-600 text-xs mt-1">Enter a number between 1 and 500.</div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="cursorPricePerUser">Cursor price per user per month ($)</Label>
                  <Input
                    id="cursorPricePerUser"
                    type="number"
                    step={1}
                    min={1}
                    max={200}
                    {...register("cursorPricePerUser", {
                      required: true,
                      valueAsNumber: true,
                      min: 1,
                      max: 200,
                    })}
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground">
                    The monthly cost per user for Cursor subscriptions (in USD). Default: $32
                  </div>
                  {errors.cursorPricePerUser && (
                    <div className="text-red-600 text-xs mt-1">Enter a number between 1 and 200.</div>
                  )}
                </div>
                
                <div>
                  <Label className="mb-1 block">Theme</Label>
                  <Controller
                    control={control}
                    name="theme"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-6"
                      >
                        <div>
                          <RadioGroupItem value="light" id="theme-light"/>
                          <Label htmlFor="theme-light" className="ml-2">Light</Label>
                        </div>
                        <div>
                          <RadioGroupItem value="dark" id="theme-dark"/>
                          <Label htmlFor="theme-dark" className="ml-2">Dark</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-between mt-6">
                <Button type="button" variant="secondary" onClick={() => { reset({ linesPerMinute: 10, theme: "light", pricePerHour: 55, cursorPricePerUser: 32 }); resetDefaults(); }}>
                  Reset to Defaults
                </Button>
                <Button type="submit" variant="default" disabled={!isDirty}>
                  Save Settings
                </Button>
              </div>
            </div>
          </form>

          <Separator />

          {/* Chart Visibility Settings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Chart Visibility</h3>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={showAllCharts}>
                  Show All
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={hideAllCharts}>
                  Hide All
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {Object.entries(chartLabels).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="text-sm font-normal">
                    {label}
                  </Label>
                  <Switch
                    id={key}
                    checked={settings.chartVisibility[key as keyof typeof settings.chartVisibility]}
                    onCheckedChange={() => toggleChartVisibility(key as keyof typeof settings.chartVisibility)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
