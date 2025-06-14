
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/contexts/SettingsContext";

export interface DashboardSettingsSheetProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

interface FormFields {
  linesPerMinute: number;
  theme: "light" | "dark";
  pricePerHour: number;
}

export const DashboardSettings: React.FC<DashboardSettingsSheetProps> = ({ open, onOpenChange }) => {
  const { settings, updateSetting, resetDefaults } = useSettings();
  const { register, handleSubmit, reset, control, formState: { errors, isDirty } } = useForm<FormFields>({
    defaultValues: { 
      linesPerMinute: settings.linesPerMinute, 
      theme: settings.theme,
      pricePerHour: settings.pricePerHour 
    },
    mode: "onBlur",
  });

  // Reset form when sheet opens or settings change
  React.useEffect(() => {
    if (open) {
      reset({ 
        linesPerMinute: settings.linesPerMinute, 
        theme: settings.theme,
        pricePerHour: settings.pricePerHour 
      });
    }
  }, [open, settings.linesPerMinute, settings.theme, settings.pricePerHour, reset]);

  const onSubmit = (values: FormFields) => {
    updateSetting("linesPerMinute", values.linesPerMinute);
    updateSetting("theme", values.theme);
    updateSetting("pricePerHour", values.pricePerHour);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[96vw] max-w-xs sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize dashboard calculations and preferences for your team.
          </SheetDescription>
        </SheetHeader>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="flex gap-2 justify-between">
            <Button type="button" variant="secondary" onClick={() => { reset({ linesPerMinute: 10, theme: "light", pricePerHour: 55 }); resetDefaults(); }}>
              Reset to Defaults
            </Button>
            <Button type="submit" variant="default" disabled={!isDirty}>
              Save Settings
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
