import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const checkPaymentStatus = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const organizationId = auth?.orgId;
    if (!organizationId) {
      throw new Error("organization doesn't exist");
    }
    const result = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
    return result;
  },
});

export const saveKeys = mutation({
  args: {
    keyName: v.string(),
    publicKey: v.string(),
    secretKey: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const organizationId = auth?.orgId as string;
    if (!organizationId) {
      throw new Error("organization doesn't exist");
    }
    const result = await ctx.db.insert("apiKeys", {
      keyName: args.keyName,
      provider: "stripe",
      publicKeyPrefix: args.publicKey.slice(0, 9),
      secretKeyPrefix: args.secretKey.slice(0, 9),
      organizationId,
      userId: auth.subject,
    });
    return result;
  },
});
