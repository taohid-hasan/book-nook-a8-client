import type { Metadata } from "next";
import { Suspense } from "react";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { PageLoader } from "@/components/shared/loading";
import { BookDetail } from "./_components/book-detail";

export const metadata: Metadata = {
  title: "BookNook | Book Details",
  description: "Borrow a book from the BookNook shared library shelf.",
};

async function BookDetailContent({
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

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PageLoader label="Pulling the book from the shelf…" />}>
      <BookDetailContent params={params} />
    </Suspense>
  );
}
