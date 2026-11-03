"use client";

import { useState } from "react";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BOOK_CATEGORIES, CATEGORY_META, type BookCategoryFilter } from "@/types/book";

interface BookFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: BookCategoryFilter;
  onCategoryChange: (category: BookCategoryFilter) => void;
}

export function BookFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: BookFiltersProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative w-full sm:max-w-md">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search by title or author…"
          aria-label="Search books by title or author"
          className={cn(
            "h-11 rounded-full border-border bg-background pr-10 pl-10 transition-shadow",
            searchFocused && "ring-3 ring-ring/20",
          )}
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear the search"
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <SlidersHorizontalIcon className="size-3.5" aria-hidden />
          Shelves
        </span>
        <button
          type="button"
          onClick={() => onCategoryChange("All")}
          aria-pressed={category === "All"}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
            category === "All"
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-card text-muted-foreground hover:border-accent/60 hover:text-foreground",
          )}
        >
          All
        </button>
        {BOOK_CATEGORIES.map((item) => {
          const active = category === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-accent/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full bg-current",
                  !active && CATEGORY_META[item].spineClass,
                )}
                aria-hidden
              />
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
