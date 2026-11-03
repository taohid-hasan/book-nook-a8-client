import type { Metadata } from "next";
import Link from "next/link";
import { BookXIcon, HomeIcon, LibraryBigIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BookNook | Book Not Found",
  description: "This book is not on the BookNook shelves.",
};

export default function BookNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <span className="flex size-20 items-center justify-center rounded-full border border-border bg-card text-accent shadow-sm">
        <BookXIcon className="size-9" aria-hidden />
      </span>
      <p className="mt-6 text-xs font-semibold tracking-[0.24em] text-accent uppercase">
        Not on the shelf
      </p>
      <h1 className="mt-3 font-heading text-4xl font-semibold text-balance sm:text-5xl">
        This book has left the nook
      </h1>
      <span className="bookmark-ribbon mt-5" aria-hidden />
      <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        The title may have been removed by its keeper, borrowed to the last copy, or
        the link may be out of date. The rest of the shelves are still open.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
          <HomeIcon aria-hidden />
          Back to Home
        </Link>
        <Link
          href="/books"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          <LibraryBigIcon aria-hidden />
          Browse all books
        </Link>
      </div>
    </div>
  );
}
