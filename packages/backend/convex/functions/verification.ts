import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const updateStatus = mutation({
  args: { id: v.id("userIdentity") },
  handler: async (ctx, args) => {
    const { id } = args;
    const result = await ctx.db.patch("userIdentity", id, {
      verificationStatus: "in-review",
    });
    return result;
  },
});

export const verificationRecord = mutation({
  args: {
    isAuthorized: v.boolean(),
    documentType: v.string(),
    notes: v.string(),
    userId: v.id("citizens"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("userIdentity", {
      ...args,
      citizenId: args.userId,
    });
    return result;
  },
});
