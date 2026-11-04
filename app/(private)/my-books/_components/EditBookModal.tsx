"use client";

import { toast } from "sonner";

import { BookForm } from "@/components/shared/book-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateBook } from "@/lib/api";
import type { Book, BookInput } from "@/types/book";

interface EditBookModalProps {
  book: Book | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (book: Book) => void;
}

export function EditBookModal({
  book,
  onOpenChange,
  onSaved,
}: EditBookModalProps) {
  async function handleSave(values: BookInput) {
    if (!book) return;

    const updated = await updateBook(book._id, values);
    toast.success("Book updated", {
      description: `"${updated.title}" now shows the new details.`,
    });
    onSaved(updated);
    onOpenChange(false);
  }

  return (
    <Dialog
      open={Boolean(book)}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto p-5 sm:max-w-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-semibold">
            Edit this book
          </DialogTitle>
          <DialogDescription>
            Update the shelf details. Changes appear immediately for every reader.
          </DialogDescription>
        </DialogHeader>

        {book ? (
          <BookForm
            key={book._id}
            initialValues={{
              title: book.title,
              author: book.author,
              category: (book.category as BookInput["category"]) ?? "Others",
              image: book.image,
              description: book.description,
              totalCopies: book.totalCopies,
            }}
            submitLabel="Save changes"
            submittingLabel="Saving…"
            onSubmit={handleSave}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
