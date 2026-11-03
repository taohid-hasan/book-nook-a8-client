import type { Metadata } from "next";

import { AddBookForm } from "./_components/AddBookForm";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | Add Book",
  description:
    "Add a book to the shared BookNook shelf with a cover, description, and copy count.",
};

export default function AddBookPage() {
  return (
    <>
      <PageTitle title="Add Book" />
      <AddBookForm />
    </>
  );
}
