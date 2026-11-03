"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, LogOutIcon, UserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSignOut } from "@/hooks/use-sign-out";
import { cn, initials } from "@/lib/utils";

export interface NavUser {
  name: string;
  email: string;
  image?: string | null;
}

export function UserMenu({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut, signingOut } = useSignOut();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open your account menu"
        className="flex items-center gap-1 rounded-full border border-border bg-card p-1 transition-colors hover:border-accent/60"
      >
        <Avatar size="sm" className="size-8">
          {user.image ? (
            <AvatarImage
              src={user.image}
              alt=""
              referrerPolicy="no-referrer"
            />
          ) : null}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <ChevronDownIcon
          className={cn(
            "mr-1 size-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="animate-in fade-in-0 zoom-in-95 absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-xl"
        >
          <div className="border-b border-border/70 px-3 py-2.5">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <div className="py-1.5">
            <Link
              href="/profile"
              role="menuitem"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <UserRoundIcon className="size-4 text-accent" aria-hidden />
              My Profile
            </Link>
          </div>
          <div className="border-t border-border/70 pt-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => void signOut()}
              disabled={signingOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
            >
              <LogOutIcon className="size-4" aria-hidden />
              {signingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
