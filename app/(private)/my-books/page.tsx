import type { Metadata } from "next";
import Link from "next/link";

import { MyBooksView } from "./_components/my-books-view";
import { PrivatePageHeader } from "../_components/private-page-header";
import { PageTitle } from "@/components/shared/page-title";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookPlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "BookNook | My Books",
  description: "Every book you have added to the BookNook shelves.",
};

export default function MyBooksPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageTitle title="My Books" />
      <PrivatePageHeader
        eyebrow="Your shelf"
        title="My books"
        description="Every book you have added to BookNook, gathered in one place. Edit the details, adjust copies, or take a title off the shelf."
        action={
          <Link href="/add-book" className={cn(buttonVariants({ size: "sm" }))}>
            <BookPlusIcon aria-hidden />
            Add a book
          </Link>
        }
      />
      <MyBooksView />
    </div>
  );
}
