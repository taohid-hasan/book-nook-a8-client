"use client";

import { useState } from "react";
import { BookOpenIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface BookCoverProps {
  src?: string | null;
  title: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  titleClassName?: string;
  iconClassName?: string;
  label?: string;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Renders a book cover and swaps in a titled placeholder when the image is
 * missing or fails to load, so no shelf ever shows a broken image icon.
 */
export function BookCover({
  src,
  title,
  className,
  imageClassName,
  fallbackClassName,
  titleClassName,
  iconClassName,
  label,
  loading = "lazy",
  onLoad,
  onError,
}: BookCoverProps) {
  const normalizedSrc = src?.trim() ?? "";
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(normalizedSrc) && failedSrc !== normalizedSrc;

  return (
    <div className={cn("overflow-hidden bg-secondary", className)}>
      {showImage ? (
        // Covers may come from imgbb or any user-supplied URL, so a native
        // image keeps arbitrary hosts working without a domain allowlist.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={normalizedSrc}
          alt={`Cover of ${title}`}
          className={cn("h-full w-full object-cover", imageClassName)}
          loading={loading}
          referrerPolicy="no-referrer"
          onLoad={onLoad}
          onError={() => {
            setFailedSrc(normalizedSrc);
            onError?.();
          }}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(145deg,var(--secondary),var(--card))] p-2 text-center",
            fallbackClassName,
          )}
        >
          <BookOpenIcon
            className={cn("size-5 shrink-0 opacity-70", iconClassName)}
            aria-hidden
          />
          <span
            className={cn(
              "line-clamp-3 font-heading text-xs leading-snug text-foreground/90",
              titleClassName,
            )}
          >
            {title}
          </span>
          {label ? (
            <span className="text-[0.5rem] font-semibold tracking-[0.18em] uppercase opacity-70">
              {label}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
