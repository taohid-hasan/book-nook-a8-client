import { Suspense } from "react";

import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { NavbarFallback } from "@/components/shared/NavbarFallback";
import { PageLoader } from "@/components/shared/loading";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

/**
 * Auth-gated pages render a session spinner on the server, so they cannot
 * produce a fully instant static shell. Opt this route group out of the
 * instant-navigation validation while keeping the client-side guard.
 */
export const instant = false;

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PageLoader label="Checking your library card…" />}>
      <ProtectedRoute>
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </ProtectedRoute>
    </Suspense>
  );
}
