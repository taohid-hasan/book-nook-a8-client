"use client";

import { useEffect, useState } from "react";

const BUILD_YEAR = 2026;

/** Reads the clock on the client so static pages can still prerender. */
export function CopyrightYear() {
  const [year, setYear] = useState(BUILD_YEAR);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span suppressHydrationWarning>{year}</span>;
}
