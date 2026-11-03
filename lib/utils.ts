export { cn } from "cn";

/** Human friendly date, e.g. "12 Nov 2026". */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Long date used on the checkout slip, e.g. "Thursday, 12 November 2026". */
export function formatLongDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Whole days from now until the given date. Negative values mean overdue. */
export function daysUntil(value: string | Date | null | undefined): number {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 0;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - startOfToday.getTime()) / 86_400_000);
}

export function isOverdue(value: string | Date | null | undefined): boolean {
  return daysUntil(value) < 0;
}

export function initials(name: string | null | undefined): string {
  if (!name) return "BR";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "BR";
}

export function firstName(name: string | null | undefined): string {
  return name?.trim().split(/\s+/)[0] || "reader";
}

export const PASSWORD_RULE_MESSAGE =
  "Password must be at least 6 characters and include one uppercase and one lowercase letter.";

/** Shared by the register form, the profile form, and Better Auth hooks. */
export function isValidPassword(password: string): boolean {
  return password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);
}
