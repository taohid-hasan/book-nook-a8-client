import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";

import { getDb, mongoClient } from "@/lib/mongodb";
import { isValidPassword, PASSWORD_RULE_MESSAGE } from "@/lib/utils";

const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

/**
 * A stable development fallback keeps `next build` working before a
 * deployment secret is configured. Always set BETTER_AUTH_SECRET in
 * production so sessions and JWT cookies are signed with a private key.
 */
const secret =
  process.env.BETTER_AUTH_SECRET ??
  "booknook-development-secret-change-me-2026";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  appName: "BookNook",
  baseURL,
  secret,
  trustedOrigins: [
    baseURL,
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
    "http://localhost:3000",
  ],
  database: mongodbAdapter(getDb(), { client: mongoClient }),
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : undefined,
  emailAndPassword: {
    enabled: true,
    // The assignment's rule is six characters; the default is eight.
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password;
        if (typeof password === "string" && !isValidPassword(password)) {
          throw new APIError("BAD_REQUEST", {
            message: PASSWORD_RULE_MESSAGE,
          });
        }
      }

      if (ctx.path === "/change-password") {
        const password = ctx.body?.newPassword;
        if (typeof password === "string" && !isValidPassword(password)) {
          throw new APIError("BAD_REQUEST", {
            message: PASSWORD_RULE_MESSAGE,
          });
        }
      }
    }),
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? "",
        }),
      },
    }),
    // Must stay last: mirrors auth cookies onto Next.js responses.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
