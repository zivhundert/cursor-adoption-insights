
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";

export interface DashboardSettingsSheetProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}

interface FormFields {
  linesPerMinute: number;
}

export const DashboardSettings: React.FC<DashboardSettingsSheetProps> = ({ open, onOpenChange }) => {
  const { settings, updateSetting, resetDefaults } = useSettings();
  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<FormFields>({
    defaultValues: { linesPerMinute: settings.linesPerMinute },
    mode: "onBlur",
  });

  // Reset form when sheet opens
  React.useEffect(() => {
    if (open) {
      reset({ linesPerMinute: settings.linesPerMinute });
    }
  }, [open, settings.linesPerMinute, reset]);

  const onSubmit = (values: FormFields) => {
    updateSetting("linesPerMinute", values.linesPerMinute);
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
          <div className="flex gap-2 justify-between">
            <Button type="button" variant="secondary" onClick={() => { reset({ linesPerMinute: 10 }); resetDefaults(); }}>
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
