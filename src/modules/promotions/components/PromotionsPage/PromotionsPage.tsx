"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Search } from "lucide-react";
import { useDebounce } from "@/core/hooks";
import { PromotionComparisonTable } from "../PromotionComparisonTable/PromotionComparisonTable";
import { promotionsService } from "../../services/promotionsService";
import type {
  PromotionComparison,
  PromotionComparisonsFilters,
} from "../../types";
import { Card, CardContent } from "@/core/components/ui/card";

export function PromotionsPage() {
  const [comparisons, setComparisons] = useState<PromotionComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PromotionComparisonsFilters>({
    page: 1,
    limit: 10,
    status: "pending",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  // Fetch comparisons
  const fetchComparisons = async (
    currentFilters: PromotionComparisonsFilters
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await promotionsService.getComparisons(currentFilters);
      if (response.success && response.data) {
        setComparisons(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || "Failed to fetch comparisons");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Update search filter
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      promotion_id: debouncedSearch || undefined,
      page: 1, // Reset to first page on search
    }));
  }, [debouncedSearch]);

  // Fetch when filters change
  useEffect(() => {
    fetchComparisons(filters);
  }, [filters]);

  const handleFilterChange = (
    key: keyof PromotionComparisonsFilters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleUpdate = async (
    comparisonId: string,
    action: "update" | "add" | "ignore"
  ) => {
    try {
      await promotionsService.updateComparison(comparisonId, { action });
      // Refresh the list
      await fetchComparisons(filters);
    } catch (err) {
      console.error("Failed to update comparison:", err);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-[1200px]">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Promotion Comparison</h1>
          <p className="text-muted-foreground">
            Compare current database promotions with discovered promotions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[264px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by promotion ID..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-9 bg-background pl-9 pr-3"
          />
        </div>
        <Select
          value={filters.casino || "all"}
          onValueChange={(value) => handleFilterChange("casino", value)}
        >
          <SelectTrigger className="h-9 w-[200px]">
            <SelectValue placeholder="All Casinos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Casinos</SelectItem>
            {/* In a real app, these would come from an API */}
            <SelectItem value="Borgata">Borgata</SelectItem>
            <SelectItem value="Golden Nugget">Golden Nugget</SelectItem>
            <SelectItem value="BetMGM">BetMGM</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.state || "all"}
          onValueChange={(value) => handleFilterChange("state", value)}
        >
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="NJ">New Jersey</SelectItem>
            <SelectItem value="MI">Michigan</SelectItem>
            <SelectItem value="PA">Pennsylvania</SelectItem>
            <SelectItem value="WV">West Virginia</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.offer_type || "all"}
          onValueChange={(value) => handleFilterChange("offer_type", value)}
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Deposit Bonus">Deposit Bonus</SelectItem>
            <SelectItem value="No Deposit Bonus">No Deposit Bonus</SelectItem>
            <SelectItem value="Free Spins">Free Spins</SelectItem>
            <SelectItem value="Reload Bonus">Reload Bonus</SelectItem>
            <SelectItem value="Risk-Free Bet">Risk-Free Bet</SelectItem>
            <SelectItem value="Welcome Package">Welcome Package</SelectItem>
            <SelectItem value="Cashback">Cashback</SelectItem>
            <SelectItem value="VIP Bonus">VIP Bonus</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.insight || "all"}
          onValueChange={(value) => handleFilterChange("insight", value)}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="All Insights" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Insights</SelectItem>
            <SelectItem value="better">Better</SelectItem>
            <SelectItem value="alternative">Alternative</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">{error}</div>
          ) : (
            <PromotionComparisonTable
              comparisons={comparisons}
              onUpdate={handleUpdate}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && !error && comparisons.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevious}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground px-4">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
