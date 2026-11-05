import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "../_components/LoginForm";
import { safeRedirect } from "../_components/auth-utils";
import { PageLoader } from "@/components/shared/loading";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | Login",
  description:
    "Sign in to your BookNook library card to add books, borrow books, and return them.",
};

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const redirect = safeRedirect(
    typeof params.redirect === "string" ? params.redirect : undefined,
  );

  return <LoginForm redirect={redirect} />;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <>
      <PageTitle title="Login" />
      <Suspense fallback={<PageLoader label="Finding the front desk…" />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
