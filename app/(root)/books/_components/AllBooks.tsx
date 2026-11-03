"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookPlusIcon } from "lucide-react";

import { BookFilters } from "./BookFilters";
import { BookCard } from "@/components/shared/BookCard";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/Spinner";
import { SectionHeading } from "@/components/shared/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { getBooks } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  BOOK_CATEGORIES,
  type Book,
  type BookCategoryFilter,
} from "@/types/book";

interface AllBooksProps {
  initialCategory?: string;
}

function readCategory(value: string | undefined): BookCategoryFilter {
  if (value && BOOK_CATEGORIES.includes(value as (typeof BOOK_CATEGORIES)[number])) {
    return value as BookCategoryFilter;
  }
  return "All";
}

function BookCardSkeleton() {
  return (
    <div className="flex h-full overflow-hidden rounded-2xl border border-border/80 bg-card">
      <div className="w-2 shrink-0 bg-muted" />
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <Skeleton className="aspect-[3/4] w-full rounded-xl" />
        <Skeleton className="mt-4 h-4 w-2/3 rounded-full" />
        <Skeleton className="mt-2 h-3 w-1/2 rounded-full" />
        <Skeleton className="mt-4 h-3 w-full rounded-full" />
        <Skeleton className="mt-2 h-3 w-4/5 rounded-full" />
        <Skeleton className="mt-5 h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

export function AllBooks({ initialCategory }: AllBooksProps) {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState<BookCategoryFilter>(() =>
    readCategory(initialCategory),
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const result = await getBooks({
        category: category === "All" ? undefined : category,
        search: debouncedSearch || undefined,
        sort: "newest",
      });
      if (requestId.current === current) setBooks(result);
    } catch (err) {
      if (requestId.current === current) {
        setError(
          err instanceof Error ? err.message : "The catalogue could not be loaded.",
        );
      }
    } finally {
      if (requestId.current === current) setLoading(false);
    }
  }, [category, debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  function selectCategory(next: BookCategoryFilter) {
    setCategory(next);
    router.replace(
      next === "All" ? "/books" : `/books?category=${encodeURIComponent(next)}`,
      { scroll: false },
    );
  }

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    selectCategory("All");
  }

  const filtersActive = category !== "All" || debouncedSearch.length > 0;

  const countLabel = useMemo(() => {
    if (loading) return "Checking the shelves…";
    if (books.length === 0) return "No books found";
    return `${books.length} ${books.length === 1 ? "book" : "books"} on the shelf`;
  }, [books.length, loading]);

  return (
    <>
      <section className="border-b border-border/70 bg-card/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeading
            eyebrow="The catalogue"
            title="All books in the nook"
            description="Wander every shelf at once. Search by title or author, or follow a coloured spine to a category."
            className="max-w-2xl"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <BookFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={selectCategory}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-6">
          <p className="text-sm text-muted-foreground">{countLabel}</p>
          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-accent underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          ) : (
            <p className="text-xs text-muted-foreground">Sorted by newest first</p>
          )}
        </div>

        <div className="mt-8">
          {loading ? (
            <div role="status" aria-live="polite">
              <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                <Spinner className="size-5" label="Loading the shelves" />
                Walking the shelves…
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <BookCardSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : null}

          {!loading && error ? (
            <ErrorState message={error} onRetry={() => void load()} />
          ) : null}

          {!loading && !error && books.length === 0 ? (
            <EmptyState
              title="No books on this shelf yet"
              description={
                filtersActive
                  ? "Nothing matches that combination of shelf and search. Try clearing the filters or adding the book yourself."
                  : "Every library starts with a single book. Add the first title and open the shelves."
              }
              actionLabel={filtersActive ? "Clear filters" : "Add the first book"}
              onAction={filtersActive ? clearFilters : undefined}
              actionHref={filtersActive ? undefined : "/add-book"}
              icon={<BookPlusIcon className="size-6" aria-hidden />}
            />
          ) : null}

          {!loading && !error && books.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.3),
                    ease: "easeOut",
                  }}
                  className="h-full"
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>

        {!loading && !error ? (
          <div className="mt-10 flex justify-center">
            <Link
              href="/add-book"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <BookPlusIcon aria-hidden />
              Add a book to the nook
            </Link>
          </div>
        ) : null}
      </section>
    </>
  );
}
