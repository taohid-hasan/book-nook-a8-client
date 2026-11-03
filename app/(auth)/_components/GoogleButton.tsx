"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

interface GoogleButtonProps {
  callbackURL?: string;
  label?: string;
}

export function GoogleButton({
  callbackURL = "/",
  label = "Continue with Google",
}: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });

    if (error) {
      setLoading(false);
      toast.error("Google sign-in didn't start", {
        description:
          error.message ||
          "Google sign-in is not configured yet. Use email and password instead.",
      });
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={() => void handleClick()}
      disabled={loading}
    >
      {loading ? (
        <Spinner className="size-4" />
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path
            fill="#4285F4"
            d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.63h6.2a5.3 5.3 0 0 1-2.3 3.48v2.9h3.72c2.18-2 3.44-4.96 3.44-8.56Z"
          />
          <path
            fill="#34A853"
            d="M12 23.5c3.1 0 5.7-1.03 7.6-2.79l-3.71-2.9c-1.03.7-2.35 1.1-3.89 1.1-2.99 0-5.52-2.02-6.43-4.73H1.74v2.98A11.5 11.5 0 0 0 12 23.5Z"
          />
          <path
            fill="#FBBC05"
            d="M5.57 14.18a6.9 6.9 0 0 1 0-4.36V6.84H1.74a11.5 11.5 0 0 0 0 10.32l3.83-2.98Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.68 0 3.19.58 4.38 1.72l3.28-3.28A11.5 11.5 0 0 0 1.74 6.84l3.83 2.98C6.48 7.11 9.01 4.75 12 4.75Z"
          />
        </svg>
      )}
      {label}
    </Button>
  );
}
