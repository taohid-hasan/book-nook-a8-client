import Link from "next/link";
import { SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const spines = [
  { height: "h-24", color: "bg-spine-fiction", width: "w-5" },
  { height: "h-32", color: "bg-spine-science", width: "w-6" },
  { height: "h-28", color: "bg-spine-history", width: "w-4" },
  { height: "h-36", color: "bg-spine-kids", width: "w-6" },
  { height: "h-20", color: "bg-spine-others", width: "w-5" },
  { height: "h-30", color: "bg-spine-fiction", width: "w-7" },
  { height: "h-26", color: "bg-spine-history", width: "w-5" },
];

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-[0_30px_80px_-60px_rgba(43,29,20,0.75)] lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#2F4A3A_0%,#263B2F_58%,#2B1D14_100%)] p-10 text-[#FBF5E9] lg:flex">
        <div
          className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-[#E39A55]/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full border border-[#FBF5E9]/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:22px_22px]"
          aria-hidden
        />

        <div className="relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-[#FBF5E9]"
            aria-label="BookNook home"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#FBF5E9]/15">
              <SparklesIcon className="size-4 text-[#E39A55]" aria-hidden />
            </span>
            <span className="font-heading text-xl font-semibold tracking-tight">
              BookNook<span className="text-[#E39A55]">.</span>
            </span>
          </Link>

          <blockquote className="mt-14 max-w-sm">
            <p className="font-heading text-3xl leading-tight font-semibold text-balance">
              “A reader lives a thousand lives before he dies.”
            </p>
            <cite className="mt-5 block text-[0.65rem] font-semibold tracking-[0.24em] text-[#FBF5E9]/55 uppercase not-italic">
              George R.R. Martin
            </cite>
          </blockquote>

          <p className="mt-6 max-w-xs text-sm leading-relaxed text-[#FBF5E9]/70">
            One library card keeps your added books, your borrows, and your due
            dates together — like a bookmark that never slips out.
          </p>
        </div>

        <div className="relative mt-12" aria-hidden>
          <div className="flex items-end justify-center gap-2">
            {spines.map((spine, index) => (
              <span
                key={`${spine.color}-${index}`}
                className={cn(
                  "rounded-t-sm shadow-[inset_-3px_0_0_rgba(0,0,0,0.18)]",
                  spine.height,
                  spine.color,
                  spine.width,
                )}
              />
            ))}
          </div>
          <div className="mt-2 h-2 rounded-full bg-[#E39A55]/45" />
          <div className="mx-auto mt-1 h-1 w-4/5 rounded-full bg-[#FBF5E9]/10" />
        </div>
      </aside>

      <div className="bg-card p-6 sm:p-10 lg:p-12">{children}</div>
    </div>
  );
}
