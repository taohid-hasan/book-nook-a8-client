"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, MailIcon } from "lucide-react";
import { toast } from "sonner";

import { EMAIL_PATTERN, friendlyAuthError, safeRedirect } from "./auth-utils";
import { GoogleButton } from "./GoogleButton";
import { PasswordInput } from "./PasswordInput";
import { PageLoader } from "@/components/shared/loading";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

interface FieldErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  redirect?: string;
}

export function LoginForm({ redirect }: LoginFormProps) {
  const router = useRouter();
  const redirectTo = safeRedirect(redirect);
  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && session) {
      router.replace(redirectTo);
    }
  }, [isPending, session, redirectTo, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);
    setAuthError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
      rememberMe: true,
    });
    setSubmitting(false);

    if (error) {
      const message = friendlyAuthError(
        error.message,
        "Check your email and password, then try again.",
      );
      setAuthError(message);
      toast.error("Login failed", { description: message });
      return;
    }

    toast.success("Welcome back, reader", {
      description: "Your shelf is just as you left it.",
    });
    router.push(redirectTo);
    router.refresh();
  }

  if (isPending) {
    return <PageLoader label="Checking your library card…" />;
  }

  if (session) {
    return <PageLoader label="Taking you back to the shelves…" />;
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
      <SectionHeading
        eyebrow="The front desk"
        title="Welcome back, reader"
        description="Sign in with the email and password you used to join BookNook."
      />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <div className="relative">
            <MailIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="reader@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className="h-11 rounded-xl bg-background pl-9"
            />
          </div>
          {errors.email ? (
            <p id="login-email-error" className="text-xs text-destructive" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="login-password">Password</Label>
            <button
              type="button"
              onClick={() =>
                toast.info("Password reset isn't available", {
                  description:
                    "BookNook has no reset emails. Ask a librarian to help you back in.",
                })
              }
              className="text-xs font-medium text-accent underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="login-password"
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password) || Boolean(authError)}
            aria-describedby={
              errors.password || authError ? "login-password-error" : undefined
            }
            className="h-11 rounded-xl bg-background"
          />
          {errors.password ? (
            <p id="login-password-error" className="text-xs text-destructive" role="alert">
              {errors.password}
            </p>
          ) : null}
        </div>

        {authError ? (
          <p
            className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive"
            role="alert"
          >
            {authError}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="group w-full"
        >
          {submitting ? (
            <>
              <Spinner className="size-4" />
              Logging in…
            </>
          ) : (
            <>
              Login
              <ArrowRightIcon
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </>
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" aria-hidden />
        or
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>

      <GoogleButton callbackURL={redirectTo} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to the nook?{" "}
        <Link
          href={`/register${redirectTo === "/" ? "" : `?redirect=${encodeURIComponent(redirectTo)}`}`}
          className="font-semibold text-accent underline-offset-4 hover:underline"
        >
          Register
        </Link>
      </p>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        No email verification. No reset emails. Just your library card and the
        honour system.
      </p>
    </div>
  );
}
