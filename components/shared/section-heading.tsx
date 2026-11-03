import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

/**
 * The single section-title style used across BookNook.
 * Fraunces heading + the amber bookmark-ribbon ornament underneath.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        centered && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-balance font-heading text-3xl font-semibold text-foreground sm:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      <span className="bookmark-ribbon mt-1" aria-hidden />
      {description ? (
        <p
          className={cn(
            "text-pretty max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
