"use client";

import { usePageTitle } from "@/hooks/use-page-title";

/**
 * Rendered by server pages so the document title is correct on first paint,
 * while the hook keeps it in sync during client-side navigation.
 */
export function PageTitle({ title }: { title: string }) {
  usePageTitle(title);
  return null;
}
