import { PageLoader } from "@/components/shared/loading";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <PageLoader label="Opening the catalogue…" />
    </div>
  );
}
