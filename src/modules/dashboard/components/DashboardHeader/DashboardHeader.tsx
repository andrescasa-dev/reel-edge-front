"use client";

import { Button } from "@/core/components/ui/button";
import { Switch } from "@/core/components/ui/switch";
import { useState } from "react";

export interface DashboardHeaderProps {
  title: string;
  description: string;
  onRunSearch?: () => void;
  onScheduleToggle?: (enabled: boolean) => void;
  scheduleEnabled?: boolean;
  isResearching?: boolean;
  isPending?: boolean;
}

export function DashboardHeader({
  title,
  description,
  onRunSearch,
  onScheduleToggle,
  scheduleEnabled = false,
  isResearching = false,
  isPending = false,
}: DashboardHeaderProps) {
  const [dailyResearch, setDailyResearch] = useState(scheduleEnabled);

  const handleToggle = (checked: boolean) => {
    setDailyResearch(checked);
    onScheduleToggle?.(checked);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={dailyResearch}
            onCheckedChange={handleToggle}
            id="daily-research"
          />
          <label
            htmlFor="daily-research"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Daily Research
          </label>
        </div>
        <Button
          onClick={onRunSearch}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending
            ? "Processing..."
            : isResearching
            ? "Stop Research"
            : "Run Research"}
        </Button>
      </div>
    </div>
  );
}
