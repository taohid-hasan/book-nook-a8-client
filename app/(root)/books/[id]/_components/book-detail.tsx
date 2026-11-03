"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  LayersIcon,
  MailIcon,
  PencilIcon,
  SparklesIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";
import { toast } from "sonner";

import { BorrowDialog } from "./borrow-dialog";
import { BookCard } from "@/components/shared/BookCard";
import { DueStamp } from "@/components/shared/due-stamp";
import { ErrorState } from "@/components/shared/empty-state";
import { PageLoader } from "@/components/shared/loading";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePageTitle } from "@/hooks/use-page-title";
import { ApiError, deleteBook, getBook, getBooks, getMyBorrows } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import { getCategoryMeta, type Book } from "@/types/book";
import type { Borrow } from "@/types/borrow";

interface BookDetailProps {
  bookId: string;
}

export function BookDetail({ bookId }: BookDetailProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [activeBorrow, setActiveBorrow] = useState<Borrow | null>(null);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  const [borrowOpen, setBorrowOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  usePageTitle(book ? book.title : "Book Details");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMissing(false);

    try {
      const [bookResult, borrows] = await Promise.all([
        getBook(bookId),
        getMyBorrows().catch(() => [] as Borrow[]),
      ]);

      setBook(bookResult);
      const match = borrows.find(
        (borrow) => String(borrow.bookId) === String(bookResult._id),
      );
      setActiveBorrow(match ?? null);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
        setMissing(true);
      } else {
        setError(
          err instanceof Error ? err.message : "This book could not be loaded.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!book) return;
    let alive = true;

    getBooks({ category: book.category, limit: 6 })
      .then((result) => {
        if (!alive) return;
        setRelated(result.filter((item) => item._id !== book._id).slice(0, 4));
      })
      .catch(() => {
        if (alive) setRelated([]);
      });

    return () => {
      alive = false;
    };
  }, [book]);

  async function refreshBook() {
    try {
      const updated = await getBook(bookId);
      setBook(updated);
    } catch {
      // The optimistic update is enough; a later reload will resync.
    }
  }

  async function handleBorrowed(borrow: Borrow) {
    setActiveBorrow(borrow);
    setBook((current) =>
      current
        ? { ...current, availableCopies: Math.max(0, current.availableCopies - 1) }
        : current,
    );
    await refreshBook();
  }

  async function handleDelete() {
    if (!book) return;
    setDeleteBusy(true);
    try {
      await deleteBook(book._id);
      toast.success("Book removed from the shelf", {
        description: `"${book.title}" is no longer part of the catalogue.`,
      });
      router.push("/my-books");
      router.refresh();
    } catch (err) {
      toast.error("The book couldn't be removed", {
        description:
          err instanceof Error ? err.message : "Please try again in a moment.",
      });
      setDeleteBusy(false);
    }
  }

  if (missing) {
    notFound();
  }

  if (loading) {
    return <PageLoader label="Pulling the book from the shelf…" />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <ErrorState message={error} onRetry={() => void load()} />
        <div className="mt-6 flex justify-center">
          <Link
            href="/books"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ArrowLeftIcon aria-hidden />
            Back to all books
          </Link>
        </div>
      </div>
    );
  }

  if (!book) return null;

  const meta = getCategoryMeta(book.category);
  const owner = session?.user.email === book.addedBy.email;
  const available = book.availableCopies > 0;

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          All books
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto w-full max-w-[340px]"
          >
            <div className="flex overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-[0_24px_50px_-30px_rgba(43,29,20,0.6)]">
              <span
                className={cn("spine-strip mr-2 rounded-full", meta.spineClass)}
                aria-hidden
              />
              <div className={cn("aspect-[3/4] flex-1 overflow-hidden rounded-xl bg-secondary", meta.spineClass)}>
                {book.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,var(--secondary),var(--card))] p-6 text-center">
                    <BookOpenIcon className="size-9 opacity-60" aria-hidden />
                    <span className="font-heading text-2xl leading-snug text-foreground">
                      {book.title}
                    </span>
                    <span className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase opacity-70">
                      {meta.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border/80 bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  <LayersIcon className="size-4 text-accent" aria-hidden />
                  {book.availableCopies} of {book.totalCopies} copies available
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[0.6rem] font-bold tracking-wide uppercase",
                    available
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {available ? "Available" : "Checked out"}
                </span>
              </div>

              {activeBorrow ? (
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                  <div>
                    <p className="text-[0.6rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                      On your card until
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm font-semibold",
                        isOverdue(activeBorrow.returnDate) && "text-destructive",
                      )}
                    >
                      {formatDate(activeBorrow.returnDate)}
                    </p>
                  </div>
                  <DueStamp date={activeBorrow.returnDate} />
                </div>
              ) : (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClockIcon className="size-3.5 text-accent" aria-hidden />
                  Borrowed for seven days · return any time
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {activeBorrow ? (
                <>
                  <Button
                    render={<Link href="/my-borrows" />}
                    className="w-full"
                  >
                    <CheckCircle2Icon aria-hidden />
                    On your borrowing card
                  </Button>
                  <Link
                    href="/my-borrows"
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  >
                    Go to My Borrows
                  </Link>
                </>
              ) : (
                <Button
                  onClick={() => setBorrowOpen(true)}
                  disabled={!available}
                  size="lg"
                  className="w-full"
                >
                  <BookOpenIcon aria-hidden />
                  {available ? "Borrow This Book" : "Not Available"}
                </Button>
              )}

              {owner ? (
                <div className="mt-2 flex items-center gap-2">
                  <Link
                    href="/my-books"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "flex-1",
                    )}
                  >
                    <PencilIcon aria-hidden />
                    Edit details
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2Icon aria-hidden />
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-wide uppercase",
                  meta.badgeClass,
                )}
              >
                {meta.label}
              </span>
              {owner ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold text-primary">
                  <SparklesIcon className="size-3" aria-hidden />
                  Added by you
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 font-heading text-4xl leading-tight font-semibold text-balance sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">by {book.author}</p>
            <span className="bookmark-ribbon mt-5" aria-hidden />

            <p className="mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {book.description ||
                "This book has not been given a description yet. Borrow it and discover it for yourself, then tell the next reader what you found."}
            </p>

            <dl className="mt-8 grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <UserRoundIcon className="size-4" aria-hidden />
                </span>
                <div>
                  <dt className="text-[0.6rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Added by
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium">{book.addedBy.name}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <CalendarClockIcon className="size-4" aria-hidden />
                </span>
                <div>
                  <dt className="text-[0.6rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    On the shelf since
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium">{formatDate(book.createdAt)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <LayersIcon className="size-4" aria-hidden />
                </span>
                <div>
                  <dt className="text-[0.6rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Copies
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium">
                    {book.availableCopies} of {book.totalCopies} copies available
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <MailIcon className="size-4" aria-hidden />
                </span>
                <div>
                  <dt className="text-[0.6rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Keeper
                  </dt>
                  <dd className="mt-0.5 truncate text-sm font-medium">
                    {book.addedBy.email}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 rounded-2xl border border-accent/25 bg-accent/5 p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">The nook rule:</span>{" "}
                borrow for seven days, return when you finish, and leave the story on
                the shelf for the next reader. There are no late fees, only good
                manners.
              </p>
            </div>
          </motion.div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-border/70 pt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-heading text-2xl font-semibold">
                More from the {meta.label} shelf
              </h2>
              <Link
                href={`/books?category=${encodeURIComponent(meta.label)}`}
                className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <BookCard key={item._id} book={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {session?.user ? (
        <BorrowDialog
          book={book}
          borrowerName={session.user.name}
          borrowerEmail={session.user.email}
          open={borrowOpen}
          onOpenChange={setBorrowOpen}
          onBorrowed={(borrow) => void handleBorrowed(borrow)}
        />
      ) : null}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2Icon aria-hidden />
            </AlertDialogMedia>
            <AlertDialogTitle className="font-heading text-lg">
              Remove this book?
            </AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{book.title}&rdquo; and every borrow record attached to it will be
              permanently removed from the nook.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>Keep the book</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={deleteBusy}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteBusy ? "Removing…" : "Remove book"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
