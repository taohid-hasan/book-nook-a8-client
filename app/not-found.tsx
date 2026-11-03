import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookMarkedIcon, CompassIcon, HomeIcon } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { NavbarFallback } from "@/components/shared/NavbarFallback";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BookNook | Page Not Found",
  description: "This shelf is empty. Head back to the BookNook reading room.",
};

export default function NotFound() {
  return (
    <>
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <div className="relative mb-8 flex items-end justify-center gap-2" aria-hidden>
          <span className="h-24 w-5 rounded-t-sm bg-spine-history/80 sm:h-28" />
          <span className="h-32 w-5 rounded-t-sm bg-spine-fiction/90 sm:h-36" />
          <span className="flex h-20 w-28 items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-3 sm:h-24 sm:w-32">
            <BookMarkedIcon className="size-8 text-accent" />
          </span>
          <span className="h-28 w-5 rounded-t-sm bg-spine-science/80 sm:h-32" />
        </div>

        <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">
          404 · shelf not found
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold text-balance sm:text-5xl">
          This page wandered off the shelf
        </h1>
        <span className="bookmark-ribbon mt-5" aria-hidden />
        <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          The address you followed doesn&apos;t match anything in our catalogue. It may
          have been returned, renamed, or simply shelved somewhere else.
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
            <CompassIcon aria-hidden />
            Browse all books
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
