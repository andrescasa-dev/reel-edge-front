"use client";

import { Button } from "@/core/components/ui/button";

export interface DashboardHeaderProps {
  title: string;
  description: string;
  onRunSearch?: () => void;
  isResearching?: boolean;
  isPending?: boolean;
}

export function DashboardHeader({
  title,
  description,
  onRunSearch,
  isResearching = false,
  isPending = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
