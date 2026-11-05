"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenIcon, Loader2Icon, RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";

import { DueStamp } from "@/components/shared/due-stamp";
import { BookCover } from "@/components/shared/book-cover";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageLoader } from "@/components/shared/loading";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyBorrows, returnBook } from "@/lib/api";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import type { Borrow } from "@/types/borrow";

function Cover({
  image,
  title,
  className,
}: {
  image: string;
  title: string;
  className?: string;
}) {
  return (
    <BookCover
      src={image}
      title={title}
      className={cn("rounded-md border border-border", className)}
      titleClassName="line-clamp-2 text-[0.5rem] leading-tight"
      iconClassName="size-4"
    />
  );
}

export function BorrowsTable() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyBorrows();
      setBorrows(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Your borrows could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleReturn(borrow: Borrow) {
    setReturningId(borrow._id);
    try {
      await returnBook(borrow._id);
      setBorrows((current) =>
        current.filter((item) => item._id !== borrow._id),
      );
      toast.success("Book returned", {
        description: `"${borrow.bookTitle}" is back on the shelf for the next reader.`,
      });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[my-borrows] return failed", err);
      }
      toast.error(
        err instanceof Error ? err.message : "Please try again in a moment.",
      );
    } finally {
      setReturningId(null);
    }
  }

  if (loading) {
    return <PageLoader label="Finding your borrowed books…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void load()} />;
  }

  if (borrows.length === 0) {
    return (
      <EmptyState
        title="Nothing borrowed yet, go find your next read"
        description="Your borrowing card is clear. Find something on the shelves and take it home for seven days."
        actionHref="/books"
        actionLabel="Browse all books"
        icon={<BookOpenIcon className="size-6" aria-hidden />}
      />
    );
  }

  const busy = returningId !== null;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {borrows.length} {borrows.length === 1 ? "book" : "books"} out on loan
        </p>
        <Link
          href="/books"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <BookOpenIcon aria-hidden />
          Browse all books
        </Link>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-20 pl-4">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Borrow Date</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead className="pr-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrows.map((borrow) => {
              const overdue = isOverdue(borrow.returnDate);
              const isReturning = returningId === borrow._id;

              return (
                <TableRow key={borrow._id}>
                  <TableCell className="pl-4">
                    <Cover
                      image={borrow.bookImage}
                      title={borrow.bookTitle}
                      className="h-16 w-12"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="max-w-64 truncate font-heading font-semibold">
                      {borrow.bookTitle}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(borrow.borrowDate)}
                  </TableCell>
                  <TableCell>
                    <DueStamp
                      date={borrow.returnDate}
                      label={overdue ? "OVERDUE" : "Return by"}
                    />
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void handleReturn(borrow)}
                      disabled={busy}
                    >
                      {isReturning ? (
                        <>
                          <Loader2Icon className="size-4 animate-spin" aria-hidden />
                          Returning…
                        </>
                      ) : (
                        <>
                          <RotateCcwIcon aria-hidden />
                          Return Book
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {borrows.map((borrow) => {
          const overdue = isOverdue(borrow.returnDate);
          const isReturning = returningId === borrow._id;

          return (
            <article
              key={borrow._id}
              className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <Cover
                  image={borrow.bookImage}
                  title={borrow.bookTitle}
                  className="h-24 w-16 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 font-heading text-lg leading-snug font-semibold">
                    {borrow.bookTitle}
                  </h3>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-[0.6rem] font-semibold tracking-wide text-muted-foreground uppercase">
                        Borrowed
                      </dt>
                      <dd className="mt-0.5 font-medium">
                        {formatDate(borrow.borrowDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.6rem] font-semibold tracking-wide text-muted-foreground uppercase">
                        Return
                      </dt>
                      <dd className="mt-1">
                        <DueStamp
                          date={borrow.returnDate}
                          label={overdue ? "OVERDUE" : "Return by"}
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                className="mt-4 w-full"
                onClick={() => void handleReturn(borrow)}
                disabled={busy}
              >
                {isReturning ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" aria-hidden />
                    Returning…
                  </>
                ) : (
                  <>
                    <RotateCcwIcon aria-hidden />
                    Return Book
                  </>
                )}
              </Button>
            </article>
          );
        })}
      </div>
    </>
  );
}
