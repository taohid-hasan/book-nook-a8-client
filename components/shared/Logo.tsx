import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

/** Small open-book mark plus the BookNook wordmark. */
export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="BookNook home"
      className={cn("group flex shrink-0 items-center gap-2.5", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4.5"
          aria-hidden
        >
          <path d="M12 6.6C10.2 5.3 7.9 4.8 5 5.1v12.8c2.9-.3 5.2.2 7 1.5 1.8-1.3 4.1-1.8 7-1.5V5.1c-2.9-.3-5.2.2-7 1.5Z" />
          <path d="M12 6.6v12.8" />
        </svg>
      </span>
      <span className="font-heading text-xl leading-none font-semibold tracking-tight">
        BookNook<span className="text-accent">.</span>
      </span>
    </Link>
  );
}
