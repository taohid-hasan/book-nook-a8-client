import { Suspense } from "react";

import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { NavbarFallback } from "@/components/shared/NavbarFallback";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center px-4 py-12 sm:px-6 lg:py-16">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
