import { mutation, query } from "../_generated/server";
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
      process: false,
      isSpam: false,
      userId: auth.subject,
    });
    return reportId;
  },
});

export const updateReportWithAnalysis = mutation({
  args: {
    reportId: v.id("reports"),
    isSpam: v.boolean(),
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
    await ctx.db.patch(args.reportId, {
      isSpam: args.isSpam,
      process: true,
      title: args.title,
      description: args.description,
      instructions: args.instructions,
      whatNotToDo: args.whatNotToDo,
      priority: args.priority,
      inferredGoal: args.inferredGoal,
      inferredPurpose: args.inferredPurpose,
    });
    return args.reportId;
  },
});

export const getReportById = query({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    return report;
  },
});
