import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN_WEB!,
      applicationID: "convex_web",
    },
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN_ADMIN!,
      applicationID: "convex_admin",
    },
  ],
} satisfies AuthConfig;
