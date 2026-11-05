import type { Metadata } from "next";
import { Suspense } from "react";

import { AllBooks } from "./_components/AllBooks";
import { PageLoader } from "@/components/shared/loading";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | All Books",
  description:
    "Browse every book on the BookNook shelves. Search by title or author and follow a coloured spine to your next read.",
};

async function BooksContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialCategory =
    typeof params.category === "string" ? params.category : undefined;

  return <AllBooks initialCategory={initialCategory} />;
}

export default function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <>
      <PageTitle title="All Books" />
      <Suspense fallback={<PageLoader label="Opening the catalogue…" />}>
        <BooksContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
