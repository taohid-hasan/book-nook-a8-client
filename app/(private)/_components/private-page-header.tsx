import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

interface PrivatePageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/** Shared header for every private page: one heading style, one ribbon. */
export function PrivatePageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: PrivatePageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        className="max-w-2xl"
      />
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
