"use client";

import { Badge } from "@/core/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { BadgeInfo } from "lucide-react";
import type { MissingCasino } from "../../types";

interface MissingCasinoRowProps {
  casino: MissingCasino;
}

export function MissingCasinoRow({ casino }: MissingCasinoRowProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-border/50 pb-[0.8px] pt-0 px-3 gap-3">
      {/* Left section: Casino name */}
      <div className="flex-1 min-w-0">
        <p className="text-base leading-6 text-foreground truncate">
          {casino.name}
        </p>
      </div>

      {/* Middle section: Source with truncation and tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-5 max-w-[70ch] min-w-0">
            <p className="text-sm leading-5 text-muted-foreground truncate">
              {casino.source}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{casino.source}</p>
        </TooltipContent>
      </Tooltip>

      {/* State badge */}
      <Badge
        variant="outline"
        className="h-[21.587px] rounded-md px-[8.8px] py-[2.8px] text-xs leading-4 shrink-0 border-border/50"
      >
        {casino.state.Abbreviation}
      </Badge>

      {/* Right section: Promotions icon + count */}
      <div className="flex items-center gap-2 h-5 shrink-0">
        <BadgeInfo className="h-3 w-3 shrink-0 text-foreground" />
        <span className="text-sm leading-5 text-foreground whitespace-nowrap">
          {casino.promotionsFound}
        </span>
      </div>
    </div>
  );
}
