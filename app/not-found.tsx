import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link href="/" className="mt-4 inline-block underline">
        Back to Home
      </Link>
    </main>
  );
}
