import { Card } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { format } from "date-fns";

export interface CardScheduleProps {
  lastRun?: Date;
  nextRun?: Date;
  isScheduled?: boolean;
}

export function CardSchedule({
  lastRun,
  nextRun,
  isScheduled = false,
}: CardScheduleProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        {/* Clock Icon */}
        <div className="flex-shrink-0">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Last Run Text */}
        {lastRun && (
          <p className="text-sm text-muted-foreground">
            Last run:{" "}
            <span className="text-foreground">
              {format(new Date(lastRun), "MMM d, yyyy, h:mm a")}
            </span>
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Next Run Badge */}
        {isScheduled && nextRun && (
          <Badge
            variant="outline"
            className="rounded-lg border-border/40 bg-muted/50 px-2 py-0.5 text-xs font-normal"
          >
            Next: Daily at {format(new Date(nextRun), "h:mm a")}
          </Badge>
        )}
        {!isScheduled && (
          <Badge
            variant="outline"
            className="rounded-lg border-border/40 bg-muted/50 px-2 py-0.5 text-xs font-normal"
          >
            Schedule disabled
          </Badge>
        )}
      </div>
    </Card>
  );
}

