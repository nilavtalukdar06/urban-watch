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
    documentType: v.optional(v.string()),
    notes: v.string(),
    citizenId: v.id("citizens"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.db
      .query("userIdentity")
      .withIndex("by_citizenId", (q) => q.eq("citizenId", args.citizenId))
      .first();
    if (!identity) {
      throw new Error("userIdentity record not found");
    }
    await ctx.db.patch(identity._id, {
      isAuthorized: args.isAuthorized,
      documentType: args.documentType,
      notes: args.notes,
      verificationStatus: "reviewed",
    });
    return identity._id;
  },
});
