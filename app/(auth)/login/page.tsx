import type { Metadata } from "next";

import { LoginForm } from "../_components/LoginForm";
import { safeRedirect } from "../_components/auth-utils";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | Login",
  description:
    "Sign in to your BookNook library card to add books, borrow books, and return them.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const redirect = safeRedirect(
    typeof params.redirect === "string" ? params.redirect : undefined,
  );

  return (
    <>
      <PageTitle title="Login" />
      <LoginForm redirect={redirect} />
    </>
  );
}
