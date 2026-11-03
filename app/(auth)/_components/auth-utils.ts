export function safeRedirect(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith("/login") || value.startsWith("/register")) return "/";
  return value;
}

export function friendlyAuthError(message: string | undefined, fallback: string) {
  const normalized = message?.toLowerCase() ?? "";

  if (normalized.includes("invalid email or password")) {
    return "That email and password don't match our records. Try again.";
  }
  if (normalized.includes("already exists") || normalized.includes("already registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (normalized.includes("too many")) {
    return "Too many attempts in a short time. Wait a moment and try again.";
  }
  if (normalized.includes("password")) {
    return (
      message ??
      "That password doesn't meet the library rule. Use at least 6 characters with one uppercase and one lowercase letter."
    );
  }

  return message || fallback;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
