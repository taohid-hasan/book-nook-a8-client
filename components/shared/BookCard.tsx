import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { getCategoryMeta, type Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  className?: string;
  actions?: React.ReactNode;
}

export function BookCard({ book, className, actions }: BookCardProps) {
  const meta = getCategoryMeta(book.category);
  const available = book.availableCopies > 0;
  const shelfLabel = available
    ? `${book.availableCopies} of ${book.totalCopies} on shelf`
    : "All copies checked out";

  return (
    <article
      className={cn(
        "group flex h-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_10px_30px_-24px_rgba(43,29,20,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(43,29,20,0.55)]",
        className,
      )}
    >
      <div className={cn("spine-strip", meta.spineClass)} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary cover-shadow">
          {book.image ? (
            // Covers may come from imgbb or any user-supplied URL, so a native
            // image keeps arbitrary hosts working without a domain allowlist.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.image}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className={cn(
                "flex h-full flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,var(--secondary),var(--card))] p-4 text-center",
                meta.spineClass,
              )}
            >
              <BookOpenIcon className="size-7 opacity-70" aria-hidden />
              <span className="line-clamp-4 font-heading text-lg leading-snug text-foreground">
                {book.title}
              </span>
              <span className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase opacity-80">
                {meta.label}
              </span>
            </div>
          )}

          <span
            className={cn(
              "absolute top-2 left-2 rounded-full px-2 py-1 text-[0.6rem] font-semibold tracking-wide uppercase shadow-sm backdrop-blur",
              available
                ? "bg-primary/90 text-primary-foreground"
                : "bg-destructive/90 text-white",
            )}
          >
            {available ? "On shelf" : "Checked out"}
          </span>
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <Badge
            variant="outline"
            className={cn("mb-2 h-auto border py-0.5 text-[0.65rem]", meta.badgeClass)}
          >
            {meta.label}
          </Badge>

          <h3 className="line-clamp-1 font-heading text-lg leading-snug font-semibold">
            {book.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            by {book.author}
          </p>

          <p className="mt-2 line-clamp-2 min-h-9 text-xs leading-relaxed text-muted-foreground/90">
            {book.description || "A quietly waiting volume from our shelves."}
          </p>

          <div className="mt-auto flex flex-col gap-3 pt-4">
            <div className="flex items-center justify-between gap-2 text-[0.68rem] text-muted-foreground">
              <span className={cn(!available && "text-destructive")}>{shelfLabel}</span>
              <span className="truncate" suppressHydrationWarning>
                {formatDate(book.createdAt)}
              </span>
            </div>
            <Link
              href={`/books/${book._id}`}
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-full")}
            >
              View Details
            </Link>
            {actions}
          </div>
        </div>
      </div>
    </article>
  );
}
