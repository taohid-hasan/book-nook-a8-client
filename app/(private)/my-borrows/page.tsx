import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { BorrowsTable } from "./_components/BorrowsTable";
import { PrivatePageHeader } from "../_components/private-page-header";
import { PageTitle } from "@/components/shared/page-title";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BookNook | My Borrows",
  description: "The books currently checked out to your BookNook library card.",
};

export default function MyBorrowsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageTitle title="My Borrows" />
      <PrivatePageHeader
        eyebrow="On loan"
        title="My borrows"
        description="Everything currently checked out to your card. Due dates are stamped below each slip; return a book whenever you are finished."
        action={
          <Link
            href="/books"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <BookOpenIcon aria-hidden />
            All books
          </Link>
        }
      />
      <div className="mt-8">
        <BorrowsTable />
      </div>
    </div>
  );
}
