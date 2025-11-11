"use client";

import { Badge } from "@/core/components/ui/badge";
import { Gift, MapPin } from "lucide-react";
import type { MissingCasino } from "../../types";

interface MissingCasinoRowProps {
  casino: MissingCasino;
}

export function MissingCasinoRow({ casino }: MissingCasinoRowProps) {
  return (
    <div className="group flex items-center gap-4 px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors duration-150">
      {/* Main Content Area - Casino Name (Primary) */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground truncate leading-5 mb-0.5">
          {casino.name}
        </h3>
        <p className="text-xs text-muted-foreground truncate leading-4">
          {casino.source}
        </p>
      </div>

      {/* Right Section - Metadata Group */}
      <div className="flex items-center gap-3 shrink-0">
        {/* State Badge */}
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <Badge
            variant="outline"
            className="h-6 px-2 text-xs font-medium border-border/50 rounded-md"
          >
            {casino.state.Abbreviation}
          </Badge>
        </div>

        {/* Promotions Count */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 group-hover:bg-muted/70 transition-colors">
          <Gift className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground tabular-nums">
            {casino.promotionsFound}
          </span>
        </div>
      </div>
    </div>
  );
}
