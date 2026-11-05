"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  CheckIcon,
  ImageIcon,
  MailIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";
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
import { cn, isValidPassword } from "@/lib/utils";

interface FieldErrors {
  name?: string;
  email?: string;
  photoUrl?: string;
  password?: string;
}

const passwordChecks = [
  {
    label: "Needs an uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "Needs a lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "At least 6 characters",
    test: (value: string) => value.length >= 6,
  },
];

interface RegisterFormProps {
  redirect?: string;
}

export function RegisterForm({ redirect }: RegisterFormProps) {
  const router = useRouter();
  const redirectTo = safeRedirect(redirect);
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const passwordValid = isValidPassword(password);

  useEffect(() => {
    if (!isPending && session) {
      router.replace(redirectTo);
    }
  }, [isPending, session, redirectTo, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};

    if (name.trim().length < 2) {
      nextErrors.name = "Tell us the name you'd like on your library card.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (photoUrl.trim() && !/^https?:\/\/\S+$/i.test(photoUrl.trim())) {
      nextErrors.photoUrl = "Use a full image URL starting with http:// or https://.";
    }
    if (!passwordValid) {
      nextErrors.password =
        "Use at least 6 characters with one uppercase and one lowercase letter.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: photoUrl.trim() || undefined,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Registration failed", {
        description: friendlyAuthError(
          error.message,
          "Check your details and try again.",
        ),
      });
      return;
    }

    toast.success("Your library card is ready", {
      description: "Welcome to BookNook. Sign in to start borrowing.",
    });
    router.push(
      redirectTo === "/"
        ? "/login"
        : `/login?redirect=${encodeURIComponent(redirectTo)}`,
    );
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
        eyebrow="Join the nook"
        title="Create your library card"
        description="A name, an email, and a password are all you need. No verification email will follow."
      />

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="register-name">Name</Label>
          <div className="relative">
            <UserRoundIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="register-name"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              className="h-11 rounded-xl bg-background pl-9"
            />
          </div>
          {errors.name ? (
            <p id="register-name-error" className="text-xs text-destructive" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <div className="relative">
            <MailIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="reader@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              className="h-11 rounded-xl bg-background pl-9"
            />
          </div>
          {errors.email ? (
            <p id="register-email-error" className="text-xs text-destructive" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-photo">Photo URL (optional)</Label>
          <div className="relative">
            <ImageIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="register-photo"
              name="photoUrl"
              type="url"
              autoComplete="photo"
              placeholder="https://example.com/your-photo.jpg"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
              aria-invalid={Boolean(errors.photoUrl)}
              aria-describedby={
                errors.photoUrl ? "register-photo-error" : undefined
              }
              className="h-11 rounded-xl bg-background pl-9"
            />
          </div>
          {errors.photoUrl ? (
            <p id="register-photo-error" className="text-xs text-destructive" role="alert">
              {errors.photoUrl}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <PasswordInput
            id="register-password"
            name="password"
            autoComplete="new-password"
            placeholder="Choose a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "register-password-error" : "password-rules"
            }
            className="h-11 rounded-xl bg-background"
          />
          <ul id="password-rules" className="grid gap-1 pt-1">
            {passwordChecks.map((check) => {
              const passed = check.test(password);
              return (
                <li
                  key={check.label}
                  className={cn(
                    "flex items-center gap-1.5 text-[0.7rem]",
                    passed ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {passed ? (
                    <CheckIcon className="size-3" aria-hidden />
                  ) : (
                    <XIcon className="size-3" aria-hidden />
                  )}
                  {check.label}
                </li>
              );
            })}
          </ul>
          {errors.password ? (
            <p id="register-password-error" className="text-xs text-destructive" role="alert">
              {errors.password}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={submitting || !passwordValid}
          className="group w-full"
        >
          {submitting ? (
            <>
              <Spinner className="size-4" />
              Creating your card…
            </>
          ) : (
            <>
              Register
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
        Already have a library card?{" "}
        <Link
          href={
            redirectTo === "/"
              ? "/login"
              : `/login?redirect=${encodeURIComponent(redirectTo)}`
          }
          className="font-semibold text-accent underline-offset-4 hover:underline"
        >
          Login
        </Link>
      </p>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        By joining you agree to borrow kindly, return on time, and keep the
        shelves tidy for the next reader.
      </p>
    </div>
  );
}
