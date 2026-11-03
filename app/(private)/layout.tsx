import { Suspense } from "react";

import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { NavbarFallback } from "@/components/shared/NavbarFallback";
import { PageLoader } from "@/components/shared/loading";
import { RequireAuth } from "@/components/shared/require-auth";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PageLoader label="Checking your library card…" />}>
      <RequireAuth>
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        <main className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </RequireAuth>
    </Suspense>
  );
}
