"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  BookOpenCheckIcon,
  LibraryBigIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

import { BookForm } from "@/components/shared/book-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { createBook } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { BookInput } from "@/types/book";
import { PrivatePageHeader } from "../../_components/private-page-header";

const tips = [
  {
    icon: BookOpenCheckIcon,
    title: "Start with a clear title",
    body: "Use the name printed on the cover, without extra notes or series numbering.",
  },
  {
    icon: SparklesIcon,
    title: "Write a warm description",
    body: "Two or three sentences are plenty. Tell the next reader what makes it worth borrowing.",
  },
  {
    icon: LibraryBigIcon,
    title: "Count every copy",
    body: "The number you add becomes the available copies. Every borrow takes one off the shelf.",
  },
];

export function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const lenderName = session?.user.name ?? "";
  const lenderEmail = session?.user.email ?? "";

  async function handleCreate(values: BookInput) {
    const book = await createBook(values);
    toast.success("Book added to the nook", {
      description: `"${book.title}" is now on your shelf.`,
    });
    router.push("/my-books");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PrivatePageHeader
        eyebrow="Add to the shelf"
        title="Add a book"
        description="Share a title from your own collection. You become its keeper, and every reader gets a chance to borrow it."
        action={
          <Link
            href="/my-books"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeftIcon aria-hidden />
            My books
          </Link>
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-[0_18px_50px_-40px_rgba(43,29,20,0.7)] sm:p-7">
          <div className="mb-7 grid gap-4 rounded-xl border border-dashed border-border bg-secondary/40 p-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lender-name">Your name</Label>
              <Input
                id="lender-name"
                value={lenderName}
                readOnly
                disabled
                placeholder="Reader"
                className="h-11 rounded-xl bg-background/70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lender-email">Your email</Label>
              <Input
                id="lender-email"
                value={lenderEmail}
                readOnly
                disabled
                placeholder="reader@example.com"
                className="h-11 rounded-xl bg-background/70"
              />
            </div>
            <p className="text-[0.65rem] leading-relaxed text-muted-foreground sm:col-span-2">
              The library card attached to this book. The server reads it from your
              signed-in session, so there is nothing to type here.
            </p>
          </div>

          <BookForm
            submitLabel="Add Book"
            submittingLabel="Shelving…"
            onSubmit={handleCreate}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-5">
            <h2 className="font-heading text-lg font-semibold">A good shelf entry</h2>
            <span className="bookmark-ribbon mt-3" aria-hidden />
            <ul className="mt-4 space-y-4">
              {tips.map((tip) => (
                <li key={tip.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <tip.icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{tip.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {tip.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Books you add appear in{" "}
              <span className="font-semibold text-foreground">My Books</span>, where
              you can edit the details, change the number of copies, or remove the
              title entirely.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
