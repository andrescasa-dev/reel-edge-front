"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import {
  ArrowRight,
  X,
  TrendingUp,
  MapPin,
  DollarSign,
  Gift,
} from "lucide-react";
import type { PromotionComparison } from "../../types";

interface PromotionComparisonTableProps {
  comparisons: PromotionComparison[];
  onUpdate?: (
    comparisonId: string,
    action: "update" | "add" | "ignore"
  ) => void;
}

export function PromotionComparisonTable({
  comparisons,
  onUpdate,
}: PromotionComparisonTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getComparisonTypeBadge = (type: string) => {
    switch (type) {
      case "better":
        return (
          <Badge
            variant="default"
            className="bg-green-500 hover:bg-green-600 text-white border-0"
          >
            Better
          </Badge>
        );
      case "alternative":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500 hover:bg-blue-600 text-white border-0"
          >
            Alternative
          </Badge>
        );
      case "new":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500 hover:bg-purple-600 text-white border-purple-600"
          >
            New
          </Badge>
        );
      default:
        return null;
    }
  };

  const getBonusDifference = (current: number | null, discovered: number) => {
    if (current === null) return null;
    const diff = discovered - current;
    if (diff > 0) {
      return `(+${formatCurrency(diff)})`;
    }
    return null;
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[100px] font-semibold text-xs uppercase tracking-wider">
              ID
            </TableHead>
            <TableHead className="w-[200px] font-semibold text-xs uppercase tracking-wider">
              Casino
            </TableHead>
            <TableHead className="w-[300px] font-semibold text-xs uppercase tracking-wider">
              Current Promotion
            </TableHead>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[300px] font-semibold text-xs uppercase tracking-wider">
              Discovered Promotion
            </TableHead>
            <TableHead className="w-[180px] font-semibold text-xs uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    No promotions found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your filters
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            comparisons.map((comparison) => (
              <TableRow
                key={comparison.id}
                className="group hover:bg-muted/20 transition-colors border-b"
              >
                {/* ID Column */}
                <TableCell className="py-4">
                  <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {comparison.id}
                  </code>
                </TableCell>

                {/* Casino Column */}
                <TableCell className="py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground leading-5">
                        {comparison.casino.Name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <Badge
                        variant="outline"
                        className="h-5 px-2 text-xs font-medium"
                      >
                        {comparison.casino.state.Abbreviation}
                      </Badge>
                    </div>
                  </div>
                </TableCell>

                {/* Current Promotion Column */}
                <TableCell className="py-4">
                  {comparison.currentPromotion ? (
                    <div className="flex flex-col gap-3 p-3 rounded-md bg-primary/5 border border-border/50">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1.5 leading-5">
                          {comparison.currentPromotion.Offer_Name}
                        </h4>
                        <Badge variant="secondary" className="h-5 px-2 text-xs">
                          {comparison.currentPromotion.offer_type}
                        </Badge>
                      </div>
                      <div className="flex gap-4 pt-1 border-t border-border/50">
                        <div className="flex items-start gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                              Deposit
                            </div>
                            <div className="text-sm font-semibold text-foreground tabular-nums">
                              {formatCurrency(
                                comparison.currentPromotion.Expected_Deposit
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Gift className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                              Bonus
                            </div>
                            <div className="text-sm font-semibold text-foreground tabular-nums">
                              {formatCurrency(
                                comparison.currentPromotion.Expected_Bonus
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-md bg-muted/20 border border-dashed border-border/50">
                      <p className="text-xs text-muted-foreground leading-5">
                        No promotion registered for{" "}
                        <span className="font-medium">
                          {comparison.casino.state.Abbreviation}
                        </span>{" "}
                        location
                      </p>
                    </div>
                  )}
                </TableCell>

                {/* Arrow Column */}
                <TableCell className="py-4">
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                </TableCell>

                {/* Discovered Promotion Column */}
                <TableCell className="py-4">
                  <div className="flex flex-col gap-3 p-3 rounded-md bg-primary/5 border border-border/50">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1.5 leading-5">
                        {comparison.discoveredPromotion.Offer_Name}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getComparisonTypeBadge(comparison.comparisonType)}
                        <Badge variant="secondary" className="h-5 px-2 text-xs">
                          {comparison.discoveredPromotion.offer_type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-1 border-t border-border/50">
                      <div className="flex items-start gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                            Deposit
                          </div>
                          <div className="text-sm font-semibold text-foreground tabular-nums">
                            {formatCurrency(
                              comparison.discoveredPromotion.Expected_Deposit
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Gift className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                            Bonus
                          </div>
                          <div className="text-sm font-semibold text-foreground tabular-nums flex items-center gap-1">
                            {formatCurrency(
                              comparison.discoveredPromotion.Expected_Bonus
                            )}
                            {comparison.currentPromotion &&
                              getBonusDifference(
                                comparison.currentPromotion.Expected_Bonus,
                                comparison.discoveredPromotion.Expected_Bonus
                              ) && (
                                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                                  <TrendingUp className="h-3 w-3" />
                                  {getBonusDifference(
                                    comparison.currentPromotion.Expected_Bonus,
                                    comparison.discoveredPromotion
                                      .Expected_Bonus
                                  )}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Actions Column */}
                <TableCell className="py-4">
                  <div className="flex items-center justify-end gap-2">
                    {comparison.currentPromotion ? (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onUpdate?.(comparison.id, "update")}
                        className="w-[90px] h-8 text-xs font-medium"
                      >
                        Update
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onUpdate?.(comparison.id, "add")}
                        className="w-[90px] h-8 text-xs font-medium"
                      >
                        Add
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdate?.(comparison.id, "ignore")}
                      className="w-9 h-8 p-0 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
