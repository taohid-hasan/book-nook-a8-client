import { Logo } from "@/components/shared/Logo";

/**
 * Static shell shown while the interactive navbar streams in. It mirrors the
 * real header so the top of the page never jumps.
 */
export function NavbarFallback() {
  return (
    <header className="border-b border-border/70 bg-background/85">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-4 lg:flex" aria-hidden>
          <span className="h-4 w-12 rounded-full bg-muted" />
          <span className="h-4 w-16 rounded-full bg-muted" />
          <span className="h-4 w-20 rounded-full bg-muted" />
        </div>
        <div className="flex items-center gap-2" aria-hidden>
          <span className="size-9 rounded-full bg-muted" />
          <span className="h-9 w-24 rounded-full bg-muted" />
        </div>
      </div>
    </header>
  );
}
