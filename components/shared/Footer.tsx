import Link from "next/link";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { Clock3Icon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { CopyrightYear } from "@/components/shared/copyright-year";
import { Logo } from "@/components/shared/Logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-book", label: "Add Book" },
  { href: "/my-borrows", label: "My Borrows" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "BookNook on Facebook", Icon: FaFacebook },
  { href: "https://instagram.com", label: "BookNook on Instagram", Icon: FaInstagram },
  { href: "https://github.com", label: "BookNook on GitHub", Icon: FaGithub },
  { href: "https://x.com", label: "BookNook on X", Icon: FaXTwitter },
];

const contact = [
  {
    href: "mailto:hello@booknook.library",
    label: "hello@booknook.library",
    Icon: MailIcon,
  },
  {
    href: "tel:+15550142026",
    label: "+1 (555) 014-2026",
    Icon: PhoneIcon,
  },
  {
    href: "https://maps.google.com/?q=18+Paper+Lane+Maplewood",
    label: "18 Paper Lane, Maplewood",
    Icon: MapPinIcon,
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              A warm little library for the neighbourhood — add a book, borrow a
              book, and leave a story for the next reader.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {contact.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-2.5 transition-colors hover:text-accent"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">
              The reading room
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Clock3Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  Monday–Saturday
                  <br />
                  9:00 am – 8:00 pm
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock3Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  Sunday
                  <br />
                  10:00 am – 6:00 pm
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> BookNook. A quiet corner for every story.
          </p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden />
            Seven-day borrows, renewed by returning on time.
          </p>
        </div>
      </div>
    </footer>
  );
}
