import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const updateStatus = mutation({
  args: { userId: v.id("citizens") },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("user is not authenticated");
    }
    const { userId } = args;
    const identity = await ctx.db
      .query("userIdentity")
      .filter((q) => q.eq(q.field("citizenId"), userId))
      .first();
    if (!identity) {
      throw new Error("identity not found");
    }
    const id = identity._id;
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
