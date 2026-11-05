import type { Metadata } from "next";
import { Suspense } from "react";

import { RegisterForm } from "../_components/RegisterForm";
import { safeRedirect } from "../_components/auth-utils";
import { PageLoader } from "@/components/shared/loading";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | Register",
  description:
    "Create a BookNook library card. No email verification, just a name, an email, and a password.",
};

async function RegisterContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const redirect = safeRedirect(
    typeof params.redirect === "string" ? params.redirect : undefined,
  );

  return <RegisterForm redirect={redirect} />;
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <>
      <PageTitle title="Register" />
      <Suspense fallback={<PageLoader label="Opening a fresh library card…" />}>
        <RegisterContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
