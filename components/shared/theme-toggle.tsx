"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to the daylight theme" : "Switch to the lamp-lit theme"}
      title={isDark ? "Daylight theme" : "Lamp-lit theme"}
      className="size-9"
    >
      {isDark ? (
        <SunIcon className="size-[1.1rem]" aria-hidden />
      ) : (
        <MoonIcon className="size-[1.1rem]" aria-hidden />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
