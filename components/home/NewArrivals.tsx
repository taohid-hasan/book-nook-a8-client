"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, BookPlusIcon } from "lucide-react";

import { SectionHeading } from "@/components/home/SectionHeading";
import { BookCard } from "@/components/shared/BookCard";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/Spinner";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getBooks } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

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

export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBooks({ sort: "newest", limit: 6 });
      setBooks(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The new arrivals shelf could not be loaded right now.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <SectionHeading
        eyebrow="Fresh on the shelf"
        title="New Arrivals"
        description="The six most recent books added by readers like you. Borrow one for a week, or share a favourite of your own."
        className="max-w-2xl"
      />

      <div className="mt-10">
        {loading ? (
          <div role="status" aria-live="polite">
            <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
              <Spinner className="size-5" label="Loading new arrivals" />
              Fetching the newest arrivals…
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
            title="The new arrivals shelf is empty"
            description="Be the first to put a book on it. Add a title from your own collection and start the shelf."
            actionHref="/add-book"
            actionLabel="Add the first book"
            icon={<BookPlusIcon className="size-6" aria-hidden />}
          />
        ) : null}

        {!loading && !error && books.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
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

      <div className="mt-10 flex justify-center">
        <Link
          href="/books"
          className={cn(buttonVariants({ size: "lg" }), "group")}
        >
          See All Books
          <ArrowRightIcon
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </div>
    </motion.section>
  );
}
