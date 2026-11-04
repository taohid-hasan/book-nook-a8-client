"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookMarkedIcon,
  CalendarDaysIcon,
  KeyRoundIcon,
  LibraryBigIcon,
  LogOutIcon,
  MailIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/shared/password-input";
import { PageLoader } from "@/components/shared/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { getBooks, getMyBorrows } from "@/lib/api";
import {
  cn,
  formatDate,
  initials,
  isValidPassword,
  PASSWORD_RULE_MESSAGE,
} from "@/lib/utils";

interface Stats {
  added: number;
  borrowed: number;
}

export function ProfileView() {
  const id = useId();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(false);
    try {
      const [books, borrows] = await Promise.all([getBooks({ mine: true }), getMyBorrows()]);
      setStats({ added: books.length, borrowed: borrows.length });
    } catch {
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    if (!isValidPassword(newPassword)) {
      setPasswordError(PASSWORD_RULE_MESSAGE);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("The new passwords don't match.");
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("Choose a new password that is different from the old one.");
      return;
    }

    setChanging(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setChanging(false);

    if (error) {
      toast.error("Your password couldn't be changed", {
        description: error.message || "Check your current password and try again.",
      });
      return;
    }

    toast.success("Password updated", {
      description: "Your other sessions have been signed out for safety.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await authClient.signOut();
    setSigningOut(false);

    if (error) {
      toast.error("We couldn't sign you out", {
        description: error.message || "Please try again in a moment.",
      });
      return;
    }

    toast.success("Signed out", {
      description: "Your books will be waiting when you return.",
    });
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return <PageLoader label="Finding your library card…" />;
  }

  if (!session) {
    return <PageLoader label="Taking you to the front desk…" />;
  }

  const user = session.user;
  const memberSince = formatDate(user.createdAt);
  const cardNumber = `BK · ${user.id.slice(-6).toUpperCase()}`;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="checkout-slip relative overflow-hidden rounded-2xl border border-[#e6d9c3] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b-2 border-current/20 pb-5">
            <div>
              <p className="text-[0.55rem] font-bold tracking-[0.26em] uppercase opacity-55">
                BookNook Public Library
              </p>
              <p className="mt-1 font-heading text-2xl leading-none font-semibold sm:text-3xl">
                Reader&apos;s Card
              </p>
            </div>
            <span className="rubber-stamp text-[#b4472e]">
              <span className="text-[0.5rem]">Member</span>
              <span className="font-heading text-xs tracking-normal">In good standing</span>
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Avatar className="size-16 shrink-0 border-2 border-background shadow-sm">
              {user.image ? (
                <AvatarImage
                  src={user.image}
                  alt={`${user.name}'s profile photo`}
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <AvatarFallback className="bg-primary font-heading text-xl font-semibold text-primary-foreground">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-heading text-2xl font-semibold">{user.name}</p>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs opacity-65">
                <MailIcon className="size-3.5 shrink-0" aria-hidden />
                {user.email}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="checkout-rule flex items-baseline justify-between gap-4 pb-2">
              <dt className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase opacity-55">
                Card number
              </dt>
              <dd className="font-mono text-xs tracking-wider">{cardNumber}</dd>
            </div>
            <div className="checkout-rule flex items-baseline justify-between gap-4 pb-2">
              <dt className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase opacity-55">
                Member since
              </dt>
              <dd className="font-medium">{memberSince}</dd>
            </div>
            <div className="checkout-rule flex items-baseline justify-between gap-4 pb-2">
              <dt className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase opacity-55">
                Borrow period
              </dt>
              <dd className="font-medium">Seven days</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase opacity-55">
                Privileges
              </dt>
              <dd className="flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheckIcon className="size-3.5 text-primary" aria-hidden />
                Add · Borrow · Return
              </dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-current/15 pt-5">
            <p className="text-xs opacity-60">
              Keep this card close. It opens every shelf in the nook.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={signingOut}
              className="border-current/30 bg-transparent text-current hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOutIcon aria-hidden />
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LibraryBigIcon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Books added
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              {statsLoading ? (
                <Spinner className="size-5 text-accent" />
              ) : (
                <span className="font-heading text-4xl font-semibold">
                  {stats?.added ?? "—"}
                </span>
              )}
              <span className="text-xs text-muted-foreground">on your shelf</span>
            </div>
            <Link
              href="/my-books"
              className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "mt-3 -ml-2")}
            >
              View my books
            </Link>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent/15 text-accent">
              <BookMarkedIcon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Books borrowed
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              {statsLoading ? (
                <Spinner className="size-5 text-accent" />
              ) : (
                <span className="font-heading text-4xl font-semibold">
                  {stats?.borrowed ?? "—"}
                </span>
              )}
              <span className="text-xs text-muted-foreground">out on loan</span>
            </div>
            <Link
              href="/my-borrows"
              className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "mt-3 -ml-2")}
            >
              View my borrows
            </Link>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:col-span-2">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <CalendarDaysIcon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-heading text-lg font-semibold">
                  Seven days, no late fees
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Each borrow is stamped for one week. Return it from My Borrows
                  whenever you finish, and the copy is instantly available again.
                </p>
              </div>
            </div>
            {statsError ? (
              <p className="mt-4 text-xs text-destructive">
                Your counts could not be loaded right now.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border/80 bg-card p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
              <KeyRoundIcon className="size-5 text-accent" aria-hidden />
              Change your password
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use at least 6 characters with one uppercase and one lowercase letter.
            </p>
          </div>
          <SparklesIcon className="hidden size-5 text-accent/60 sm:block" aria-hidden />
        </div>

        <form
          onSubmit={handlePasswordChange}
          className="mt-6 grid gap-4 md:grid-cols-3"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor={`${id}-current`}>Current password</Label>
            <PasswordInput
              id={`${id}-current`}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Your current password"
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-new`}>New password</Label>
            <PasswordInput
              id={`${id}-new`}
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Choose a new password"
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-confirm`}>Confirm new password</Label>
            <PasswordInput
              id={`${id}-confirm`}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Type it once more"
              className="h-11 rounded-xl bg-background"
            />
          </div>

          {passwordError ? (
            <p className="text-xs text-destructive md:col-span-3" role="alert">
              {passwordError}
            </p>
          ) : null}

          <div className="md:col-span-3">
            <Button type="submit" disabled={changing} className="min-w-44">
              {changing ? (
                <>
                  <Spinner className="size-4" />
                  Updating…
                </>
              ) : (
                <>
                  <KeyRoundIcon aria-hidden />
                  Update password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
