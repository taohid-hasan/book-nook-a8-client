"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, MenuIcon, UserRoundIcon } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import type { NavUser } from "@/components/shared/UserMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSignOut } from "@/hooks/use-sign-out";
import { cn, initials, isActivePath } from "@/lib/utils";

interface MobileNavProps {
  links: { href: string; label: string }[];
  user: NavUser | null;
}

export function MobileNav({ links, user }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { signOut, signingOut } = useSignOut();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 md:hidden"
            aria-label="Open the menu"
          />
        }
      >
        <MenuIcon className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent side="right" className="w-[86%] max-w-sm overflow-y-auto p-0">
        <SheetHeader className="border-b border-border/70 px-5 py-5 text-left">
          <SheetTitle className="font-heading text-xl">
            <Logo onClick={() => setOpen(false)} />
          </SheetTitle>
          <SheetDescription>
            Add a book, borrow a book, return a book.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-5 py-6">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={
                  isActivePath(pathname, link.href) ? "page" : undefined
                }
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                  isActivePath(pathname, link.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Avatar>
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
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  render={
                    <Link href="/profile" onClick={() => setOpen(false)} />
                  }
                  variant="outline"
                  className="w-full"
                >
                  <UserRoundIcon aria-hidden />
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:bg-destructive/10"
                  onClick={() => void signOut()}
                  disabled={signingOut}
                >
                  <LogOutIcon aria-hidden />
                  {signingOut ? "Logging out…" : "Logout"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                render={<Link href="/register" onClick={() => setOpen(false)} />}
                className="w-full"
              >
                Register
              </Button>
              <Button
                render={<Link href="/login" onClick={() => setOpen(false)} />}
                variant="outline"
                className="w-full"
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
