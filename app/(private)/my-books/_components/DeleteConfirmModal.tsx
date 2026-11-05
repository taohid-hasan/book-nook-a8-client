"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
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
import { deleteBook } from "@/lib/api";
import type { Book } from "@/types/book";

interface DeleteConfirmModalProps {
  book: Book | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: (id: string) => void;
}

export function DeleteConfirmModal({
  book,
  onOpenChange,
  onDeleted,
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!book) return;

    setDeleting(true);
    try {
      await deleteBook(book._id);
      toast.success("Book removed from the shelf", {
        description: `"${book.title}" is no longer part of the catalogue.`,
      });
      onDeleted(book._id);
      onOpenChange(false);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[my-books] delete failed", err);
      }
      toast.error(
        err instanceof Error ? err.message : "Please try again in a moment.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={Boolean(book)}
      onOpenChange={(open) => {
        if (!open && !deleting) onOpenChange(false);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-heading text-lg">
            Remove this book from BookNook?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {book
              ? `"${book.title}" and every borrow record attached to it will be permanently removed.`
              : "This book will be permanently removed from BookNook."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            disabled={deleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Spinner className="size-4" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
