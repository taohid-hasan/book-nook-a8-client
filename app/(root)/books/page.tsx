import type { Metadata } from "next";

import { AllBooks } from "./_components/AllBooks";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | All Books",
  description:
    "Browse every book on the BookNook shelves. Search by title or author and follow a coloured spine to your next read.",
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialCategory =
    typeof params.category === "string" ? params.category : undefined;

  return (
    <>
      <PageTitle title="All Books" />
      <AllBooks initialCategory={initialCategory} />
    </>
  );
}
