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
    publicKeyPrefix: v.string(),
    secretKeyPrefix: v.string(),
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
    const keys = await ctx.db
      .query("apiKeys")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
    if (keys) {
      throw new Error(
        "keys already exist, delete the previous ones if you want new",
      );
    }
    const result = await ctx.db.insert("apiKeys", {
      keyName: args.keyName,
      provider: "stripe",
      publicKeyPrefix: args.publicKeyPrefix,
      secretKeyPrefix: args.secretKeyPrefix,
      organizationId,
      userId: auth.subject,
    });
    return result;
  },
});
