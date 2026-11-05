"use client";

import { useState } from "react";
import { CalendarCheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { DueStamp } from "@/components/shared/due-stamp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { borrowBook } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Book } from "@/types/book";
import type { Borrow } from "@/types/borrow";

interface BorrowModalProps {
  book: Book;
  borrowerName: string;
  borrowerEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBorrowed: (borrow: Borrow) => void;
}

export function BorrowModal({
  book,
  borrowerName,
  borrowerEmail,
  open,
  onOpenChange,
  onBorrowed,
}: BorrowModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 7);

  async function handleBorrow() {
    setSubmitting(true);
    setError(null);

    try {
      const borrow = await borrowBook(book._id);
      toast.success("Book borrowed", {
        description: `"${book.title}" is due back on ${formatDate(borrow.returnDate)}.`,
      });
      onBorrowed(borrow);
      onOpenChange(false);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[borrow] borrow failed", err);
      }
      const message =
        err instanceof Error
          ? err.message
          : "The book could not be borrowed right now.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!submitting) {
          onOpenChange(next);
          if (!next) setError(null);
        }
      }}
    >
      <DialogContent className="checkout-slip max-h-[92vh] gap-0 overflow-y-auto rounded-2xl border border-dashed border-current/30 bg-[#fffdf7] p-0 text-[#2b1d14] sm:max-w-lg dark:bg-[#241b14] dark:text-[#f3e9d8]">
        <div className="border-b-2 border-dashed border-current/25 px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[0.55rem] font-bold tracking-[0.26em] uppercase opacity-55">
                BookNook Public Library
              </p>
              <DialogTitle className="mt-1 font-heading text-2xl leading-none font-semibold">
                Library checkout slip
              </DialogTitle>
              <DialogDescription className="mt-1 font-mono text-xs opacity-60">
                Slip no. BK-{book._id.slice(-5).toUpperCase()} · one week loan
              </DialogDescription>
            </div>
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-dashed border-current/25">
              <CalendarCheckIcon className="size-5 opacity-70" aria-hidden />
            </span>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex gap-4">
            <div className="w-20 shrink-0 overflow-hidden rounded-lg border border-dashed border-current/20">
              {book.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.image}
                  alt=""
                  className="aspect-[3/4] w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-current/5 font-mono text-[0.55rem] opacity-60">
                  No cover
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 font-heading text-xl leading-snug font-semibold">
                {book.title}
              </p>
              <p className="mt-1 text-sm opacity-65">by {book.author}</p>
              <p className="mt-2 inline-flex rounded-full border border-current/25 px-2 py-0.5 font-mono text-[0.6rem] font-semibold tracking-wide uppercase opacity-70">
                {book.category}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="checkout-rule flex items-baseline justify-between gap-4 pb-2">
              <dt className="font-mono text-[0.6rem] font-semibold tracking-[0.18em] uppercase opacity-55">
                Name
              </dt>
              <dd className="max-w-[60%] truncate text-right font-medium">
                {borrowerName}
              </dd>
            </div>
            <div className="checkout-rule flex items-baseline justify-between gap-4 pb-2">
              <dt className="font-mono text-[0.6rem] font-semibold tracking-[0.18em] uppercase opacity-55">
                Email
              </dt>
              <dd className="max-w-[60%] truncate text-right text-xs">
                {borrowerEmail}
              </dd>
            </div>
            <div className="checkout-rule flex items-baseline justify-between gap-4 pb-2">
              <dt className="font-mono text-[0.6rem] font-semibold tracking-[0.18em] uppercase opacity-55">
                Return by
              </dt>
              <dd className="text-right font-semibold">{formatDate(due)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-mono text-[0.6rem] font-semibold tracking-[0.18em] uppercase opacity-55">
                Copies on shelf
              </dt>
              <dd className="text-right font-medium">
                {book.availableCopies} of {book.totalCopies}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-dashed border-current/25 p-3">
            <p className="max-w-[70%] font-mono text-[0.7rem] leading-relaxed opacity-65">
              Seven days, no late fees. Bring it back from My Borrows when you are
              finished so the next reader can find it.
            </p>
            <DueStamp date={due} className="shrink-0 text-[#b4472e]" />
          </div>

          {error ? (
            <p
              className="mt-4 text-xs font-medium text-[#b4472e] dark:text-[#e07a5f]"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter className="m-0 rounded-none border-t border-dashed border-current/25 bg-current/5 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="border-current/30 bg-transparent text-current hover:bg-current/10 hover:text-current"
          >
            Not yet
          </Button>
          <Button
            type="button"
            onClick={() => void handleBorrow()}
            disabled={submitting || book.availableCopies < 1}
          >
            {submitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
                Stamping the slip…
              </>
            ) : (
              "Confirm Borrow"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
