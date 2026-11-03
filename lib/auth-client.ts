import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_APP_URL
      : undefined,
  plugins: [jwtClient()],
});

export type AuthSession = typeof authClient.$Infer.Session;
