import type { Metadata } from "next";

import { AddBookForm } from "./_components/AddBookForm";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | Add Book",
  description:
    "Add a book to the shared BookNook shelf with a cover, description, and copy count.",
};

/** Auth-gated page: its shell waits on the session, so navigation may block. */
export const instant = false;

export default function AddBookPage() {
  return (
    <>
      <PageTitle title="Add Book" />
      <AddBookForm />
    </>
  );
}
