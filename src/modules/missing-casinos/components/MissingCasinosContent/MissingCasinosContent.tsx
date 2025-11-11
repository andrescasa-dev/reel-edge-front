"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/core/components/ui/card";
import { TooltipProvider } from "@/core/components/ui/tooltip";
import { MissingCasinoRow } from "../MissingCasinoRow";
import { MissingCasinosFilters } from "../MissingCasinosFilters";
import { useMissingCasinosFlat } from "../../hooks/useMissingCasinos";

export function MissingCasinosContent() {
  const [state, setState] = useState<"NJ" | "MI" | "PA" | "WV" | undefined>();
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<{ state?: "NJ" | "MI" | "PA" | "WV"; search?: string }>({});

  // Update filters when state or search changes
  useEffect(() => {
    setFilters({
      state,
      search: search || undefined,
    });
  }, [state, search]);

  const {
    data,
    total,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
    error,
  } = useMissingCasinosFlat(filters);

  // Infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">
          Error loading casinos: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-normal leading-9 text-foreground">
          Missing Casinos
        </h1>
        <p className="text-base text-muted-foreground">
          Casinos found in regulatory sources but not in database
        </p>
      </div>

      {/* Filters */}
      <MissingCasinosFilters
        state={state}
        search={search}
        onStateChange={setState}
        onSearchChange={setSearch}
      />

      {/* List */}
      <Card className="rounded-[14px] border">
        <CardContent className="p-0">
          {isLoading && data.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Loading casinos...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">No casinos found</p>
            </div>
          ) : (
            <TooltipProvider>
              <>
                <div className="divide-y divide-border">
                  {data.map((casino) => (
                    <MissingCasinoRow key={casino.id} casino={casino} />
                  ))}
                </div>
              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className="h-4" />
              {isFetchingNextPage && (
                <div className="flex items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground">Loading more...</p>
                </div>
              )}
                {!hasNextPage && data.length > 0 && (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {data.length} of {total} casinos
                    </p>
                  </div>
                )}
              </>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

