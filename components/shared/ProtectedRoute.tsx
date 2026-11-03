"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Spinner } from "@/components/shared/Spinner";
import { authClient } from "@/lib/auth-client";

/**
 * Waits for Better Auth's session request to finish before making a decision.
 * While `isPending` is true it only renders the spinner and never redirects, so
 * a signed-in reader reloading a private page is never bounced to /login.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending || session) return;

    const redirect = encodeURIComponent(pathname || "/");
    router.replace(`/login?redirect=${redirect}`);
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <Spinner className="size-14" label="Checking your session" />
        <p className="text-sm font-medium text-muted-foreground">
          Checking your library card…
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <Spinner className="size-14" label="Redirecting to login" />
        <p className="text-sm font-medium text-muted-foreground">
          Taking you to the front desk…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
