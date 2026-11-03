import { BookOpenIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  label?: string;
}

/** A small book resting inside an animated ring. */
export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "relative inline-flex size-12 items-center justify-center",
        className,
      )}
    >
      <span
        className="absolute inset-0 animate-spin rounded-full border-2 border-border border-t-accent"
        aria-hidden
      />
      <BookOpenIcon className="size-5 text-primary" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}
