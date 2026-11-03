import type { Metadata } from "next";

import { RegisterForm } from "../_components/RegisterForm";
import { PageTitle } from "@/components/shared/page-title";

export const metadata: Metadata = {
  title: "BookNook | Register",
  description:
    "Create a BookNook library card. No email verification, just a name, an email, and a password.",
};

export default function RegisterPage() {
  return (
    <>
      <PageTitle title="Register" />
      <RegisterForm />
    </>
  );
}
