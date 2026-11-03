import Link from "next/link";

export default function BookNotFound() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-semibold">Book not found</h1>
      <Link href="/books" className="mt-4 inline-block underline">
        Browse all books
      </Link>
    </main>
  );
}
