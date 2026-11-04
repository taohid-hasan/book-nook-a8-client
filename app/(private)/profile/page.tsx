import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { ProfileView } from "./_components/profile-view";
import { PrivatePageHeader } from "../_components/private-page-header";
import { PageTitle } from "@/components/shared/page-title";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BookNook | My Profile",
  description: "Your BookNook library card, reading activity, and account settings.",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageTitle title="My Profile" />
      <PrivatePageHeader
        eyebrow="Your library card"
        title="My profile"
        description="Your account details, reading activity, and the password that keeps your library card safe."
        action={
          <Link
            href="/books"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <BookOpenIcon aria-hidden />
            Browse books
          </Link>
        }
      />
      <div className="mt-8">
        <ProfileView />
      </div>
    </div>
  );
}
