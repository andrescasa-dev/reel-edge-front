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
import { ArrowRight, X } from "lucide-react";
import type { PromotionComparison } from "../../types";

interface PromotionComparisonTableProps {
  comparisons: PromotionComparison[];
  onUpdate?: (comparisonId: string, action: "update" | "add" | "ignore") => void;
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
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Better
          </Badge>
        );
      case "alternative":
        return (
          <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">
            Alternative
          </Badge>
        );
      case "new":
        return (
          <Badge variant="outline" className="bg-purple-500 hover:bg-purple-600 text-white border-purple-600">
            New
          </Badge>
        );
      default:
        return null;
    }
  };

  const getBonusDifference = (
    current: number | null,
    discovered: number
  ) => {
    if (current === null) return null;
    const diff = discovered - current;
    if (diff > 0) {
      return `(+${formatCurrency(diff)})`;
    }
    return null;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[96px]">ID</TableHead>
            <TableHead className="w-[196px]">
              <div className="flex items-center gap-2">
                Casino
                <ArrowRight className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[280px]">Current Promotion</TableHead>
            <TableHead className="w-[56px]"></TableHead>
            <TableHead className="w-[280px]">Discovered Promotion</TableHead>
            <TableHead className="w-[176px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No promotions found
              </TableCell>
            </TableRow>
          ) : (
            comparisons.map((comparison) => (
              <TableRow key={comparison.id}>
                <TableCell className="font-mono text-sm">
                  {comparison.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="font-medium">{comparison.casino.Name}</div>
                    <Badge variant="outline" className="w-fit">
                      {comparison.casino.state.Abbreviation}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {comparison.currentPromotion ? (
                    <div className="flex flex-col gap-2">
                      <div className="font-medium">
                        {comparison.currentPromotion.Offer_Name}
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {comparison.currentPromotion.offer_type}
                      </Badge>
                      <div className="flex gap-4 mt-2">
                        <div className="flex flex-col">
                          <div className="text-xs text-muted-foreground">
                            Deposit
                          </div>
                          <div className="font-semibold">
                            {formatCurrency(
                              comparison.currentPromotion.Expected_Deposit
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-xs text-muted-foreground">
                            Bonus
                          </div>
                          <div className="font-semibold">
                            {formatCurrency(
                              comparison.currentPromotion.Expected_Bonus
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-4">
                      No promotion registered for {comparison.casino.state.Abbreviation} location
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="font-medium">
                      {comparison.discoveredPromotion.Offer_Name}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {getComparisonTypeBadge(comparison.comparisonType)}
                      <Badge variant="secondary" className="w-fit">
                        {comparison.discoveredPromotion.offer_type}
                      </Badge>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <div className="flex flex-col">
                        <div className="text-xs text-muted-foreground">
                          Deposit
                        </div>
                        <div className="font-semibold">
                          {formatCurrency(
                            comparison.discoveredPromotion.Expected_Deposit
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-xs text-muted-foreground">
                          Bonus
                        </div>
                        <div className="font-semibold flex items-center gap-1">
                          {formatCurrency(
                            comparison.discoveredPromotion.Expected_Bonus
                          )}
                          {comparison.currentPromotion &&
                            getBonusDifference(
                              comparison.currentPromotion.Expected_Bonus,
                              comparison.discoveredPromotion.Expected_Bonus
                            ) && (
                              <span className="text-xs text-green-600 font-normal">
                                {getBonusDifference(
                                  comparison.currentPromotion.Expected_Bonus,
                                  comparison.discoveredPromotion.Expected_Bonus
                                )}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {comparison.currentPromotion ? (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          onUpdate?.(comparison.id, "update")
                        }
                        className="w-[90px]"
                      >
                        Update
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onUpdate?.(comparison.id, "add")}
                        className="w-[90px]"
                      >
                        Add
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdate?.(comparison.id, "ignore")}
                      className="w-9 p-0"
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

