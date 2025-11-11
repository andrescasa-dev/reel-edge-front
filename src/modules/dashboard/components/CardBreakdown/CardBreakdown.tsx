import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";

export interface CardBreakdownProps {
  state: {
    Name: string;
    Abbreviation: string;
  };
  casinosTracked: number;
  promotionsActive: number;
  missingCasinos?: number;
  pendingComparisons?: number;
  status: "researching" | "idle";
  lastUpdated?: Date;
}

export function CardBreakdown({
  state,
  casinosTracked,
  promotionsActive,
  missingCasinos = 0,
  pendingComparisons = 0,
  status,
  lastUpdated,
}: CardBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{state.Name}</CardTitle>
          <Badge variant={status === "researching" ? "default" : "secondary"}>
            {status === "researching" ? "Active" : "Idle"}
          </Badge>
        </div>
        <CardDescription>{state.Abbreviation}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Casinos Tracked</span>
          <Badge
            variant="outline"
            className="rounded-lg border-border/40 bg-background px-2 py-0.5 text-xs font-normal"
          >
            {casinosTracked}
          </Badge>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Active Promotions</span>
          <Badge
            variant="outline"
            className="rounded-lg border-border/40 bg-background px-2 py-0.5 text-xs font-normal"
          >
            {promotionsActive}
          </Badge>
        </div>
        {missingCasinos > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Missing Casinos</span>
            <Badge
              variant="outline"
              className="rounded-lg border-border/40 bg-background px-2 py-0.5 text-xs font-normal text-orange-600"
            >
              {missingCasinos}
            </Badge>
          </div>
        )}
        {pendingComparisons > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Pending Comparisons</span>
            <Badge
              variant="outline"
              className="rounded-lg border-border/40 bg-background px-2 py-0.5 text-xs font-normal text-blue-600"
            >
              {pendingComparisons}
            </Badge>
          </div>
        )}
        {lastUpdated && (
          <div className="pt-2 border-t text-xs text-muted-foreground">
            Updated{" "}
            {(() => {
              const date = new Date(lastUpdated);
              const year = date.getUTCFullYear();
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              const month = monthNames[date.getUTCMonth()];
              const day = date.getUTCDate();
              return `${month} ${day}, ${year}`;
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
