import { cn, formatDate, isOverdue } from "@/lib/utils";

interface DueStampProps {
  date: string | Date | null | undefined;
  label?: string;
  className?: string;
}

/** The rotated rubber-stamp badge used for every due date in the app. */
export function DueStamp({ date, label = "Due back", className }: DueStampProps) {
  const overdue = isOverdue(date);

  return (
    <span
      className={cn(
        "rubber-stamp",
        overdue ? "text-destructive" : "text-accent",
        className,
      )}
      title={`${label}: ${formatDate(date)}`}
    >
      <span className="text-[0.55rem] tracking-[0.2em] opacity-80">{label}</span>
      <span className="font-heading text-sm tracking-normal">
        {formatDate(date)}
      </span>
    </span>
  );
}
