import { BookOpenIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  label?: string;
  className?: string;
}

export function PageLoader({
  label = "Gathering the books…",
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[55vh] w-full flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex size-16 items-center justify-center rounded-full border border-border bg-card shadow-sm">
        <BookOpenIcon className="size-7 text-primary" aria-hidden />
        <span className="absolute inset-0 animate-ping rounded-full border border-accent/30" />
      </span>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Spinner className="size-4 text-accent" />
        {label}
      </div>
    </div>
  );
}

interface CardGridLoaderProps {
  count?: number;
  label?: string;
}

export function CardGridLoader({
  count = 8,
  label = "Loading the shelves…",
}: CardGridLoaderProps) {
  return (
    <div className="w-full" role="status" aria-live="polite">
      <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
        <Spinner className="size-4 text-accent" />
        {label}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-4"
          >
            <div className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
            <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InlineLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner className="size-4 text-accent" />
      {label}
    </span>
  );
}
