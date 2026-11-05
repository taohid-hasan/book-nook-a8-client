"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookPlusIcon,
  LibraryBigIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { EditBookModal } from "./EditBookModal";
import { BookCover } from "@/components/shared/book-cover";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { PageLoader } from "@/components/shared/loading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBooks } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { getCategoryMeta, type Book } from "@/types/book";

export function MyBooksView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBooks({ mine: true });
      setBooks(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Your books could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function handleSaved(updated: Book) {
    setBooks((current) =>
      current.map((book) => (book._id === updated._id ? updated : book)),
    );
  }

  if (loading) {
    return <PageLoader label="Opening your books…" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void load()} />;
  }

  if (books.length === 0) {
    return (
      <EmptyState
        title="Your shelf is waiting for its first book"
        description="Add a title from your own collection. You can edit its details or change the number of copies at any time."
        actionHref="/add-book"
        actionLabel="Add your first book"
        icon={<LibraryBigIcon className="size-6" aria-hidden />}
      />
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {books.length} {books.length === 1 ? "book" : "books"} on your shelf
        </p>
        <Link
          href="/add-book"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <BookPlusIcon aria-hidden />
          Add another
        </Link>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-20 pl-4">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Date added</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => {
              const meta = getCategoryMeta(book.category);

              return (
                <TableRow key={book._id}>
                  <TableCell className="pl-4">
                    <div className="h-16 w-12 overflow-hidden rounded-md border border-border bg-secondary">
                      <BookCover
                        src={book.image}
                        title={book.title}
                        className="h-full w-full"
                        titleClassName="line-clamp-2 text-[0.5rem] leading-tight"
                        iconClassName="size-4"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-60 truncate font-heading font-semibold">
                      {book.title}
                    </p>
                    <p className="max-w-60 truncate text-xs text-muted-foreground">
                      by {book.author}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-auto border py-0.5 text-[0.65rem]",
                        meta.badgeClass,
                      )}
                    >
                      {meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-medium",
                        book.availableCopies === 0 && "text-destructive",
                      )}
                    >
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(book.createdAt)}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(book)}
                      >
                        <PencilIcon aria-hidden />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleting(book)}
                      >
                        <Trash2Icon aria-hidden />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {books.map((book) => {
          const meta = getCategoryMeta(book.category);

          return (
            <article
              key={book._id}
              className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                  <BookCover
                    src={book.image}
                    title={book.title}
                    className="h-full w-full"
                    titleClassName="text-[0.6rem] leading-tight"
                    iconClassName="size-4"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 font-heading text-lg leading-snug font-semibold">
                        {book.title}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        by {book.author}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-auto shrink-0 border py-0.5 text-[0.65rem]",
                        meta.badgeClass,
                      )}
                    >
                      {meta.label}
                    </Badge>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-[0.6rem] font-semibold tracking-wide text-muted-foreground uppercase">
                        Copies
                      </dt>
                      <dd
                        className={cn(
                          "mt-0.5 font-medium",
                          book.availableCopies === 0 && "text-destructive",
                        )}
                      >
                        {book.availableCopies} / {book.totalCopies}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.6rem] font-semibold tracking-wide text-muted-foreground uppercase">
                        Added
                      </dt>
                      <dd className="mt-0.5 font-medium">
                        {formatDate(book.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-border/70 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditing(book)}
                >
                  <PencilIcon aria-hidden />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleting(book)}
                >
                  <Trash2Icon aria-hidden />
                  Delete
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <EditBookModal
        book={editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        onSaved={handleSaved}
      />

      <DeleteConfirmModal
        book={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onDeleted={(id) =>
          setBooks((current) => current.filter((book) => book._id !== id))
        }
      />
    </div>
  );
}
