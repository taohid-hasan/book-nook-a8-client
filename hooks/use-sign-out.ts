"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

/** Shared logout flow for the desktop menu and the mobile drawer. */
export function useSignOut() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const { error } = await authClient.signOut();

    if (error) {
      setSigningOut(false);
      toast.error("We couldn't log you out", {
        description: error.message || "Please try again in a moment.",
      });
      return;
    }

    toast.success("Logged out", {
      description: "Your books will be waiting when you return.",
    });
    router.replace("/");
    router.refresh();
  }

  return { signOut, signingOut };
}
