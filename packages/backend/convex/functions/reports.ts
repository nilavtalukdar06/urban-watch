import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createReport = mutation({
  args: {
    imageUrl: v.string(),
    location: v.string(),
    notes: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    instructions: v.optional(v.array(v.string())),
    whatNotToDo: v.optional(v.array(v.string())),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    ),
    inferredGoal: v.optional(v.string()),
    inferredPurpose: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const reportId = await ctx.db.insert("reports", {
      ...args,
      isSpam: false,
      assigned: false,
      createdAt: Date.now(),
    });
    return reportId;
  },
});
