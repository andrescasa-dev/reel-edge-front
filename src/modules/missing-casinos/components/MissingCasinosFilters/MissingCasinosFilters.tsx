"use client";

import { Input } from "@/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Search } from "lucide-react";
import { useDebounce } from "@/core/hooks";
import { useState, useEffect } from "react";

interface MissingCasinosFiltersProps {
  state?: "NJ" | "MI" | "PA" | "WV";
  search?: string;
  onStateChange: (state: "NJ" | "MI" | "PA" | "WV" | undefined) => void;
  onSearchChange: (search: string) => void;
}

export function MissingCasinosFilters({
  state,
  search,
  onStateChange,
  onSearchChange,
}: MissingCasinosFiltersProps) {
  const [searchValue, setSearchValue] = useState(search || "");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className="flex h-[42px] items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search casinos..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-9 bg-muted/50 pl-9 pr-3"
        />
      </div>
      <Select value={state || "all"} onValueChange={(value) => onStateChange(value === "all" ? undefined : value as "NJ" | "MI" | "PA" | "WV")}>
        <SelectTrigger className="h-9 w-[180px] bg-muted/50">
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
    </div>
  );
}

