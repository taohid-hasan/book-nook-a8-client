import type { Metadata } from "next";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { BookDetail } from "./_components/book-detail";

export const metadata: Metadata = {
  title: "BookNook | Book Details",
  description: "Borrow a book from the BookNook shared library shelf.",
};

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <BookDetail bookId={id} />
    </ProtectedRoute>
  );
}
