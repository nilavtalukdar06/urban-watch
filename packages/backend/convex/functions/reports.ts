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
      status: "pending",
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

export const getProcessedReportsByUser = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const reports = await ctx.db
      .query("reports")
      .filter((q) => q.eq(q.field("userId"), auth.subject))
      .filter((q) => q.eq(q.field("process"), true))
      .filter((q) => q.eq(q.field("isSpam"), false))
      .collect();
    return reports;
  },
});

export const getReportDetails = query({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const result = await ctx.db.get(args.reportId);
    if (!result) {
      return null;
    }
    const citizen = await ctx.db
      .query("citizens")
      .filter((q) => q.eq(q.field("userId"), result.userId))
      .first();
    return {
      ...result,
      submittedByName: citizen?.fullName,
    };
  },
});

export const deleteReport = mutation({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("report not found");
    }
    if (report.userId !== auth.subject) {
      throw new Error("unauthorized to delete this report");
    }
    await ctx.db.delete(args.reportId);
    return {
      message: "report deleted",
    };
  },
});

export const getAllReports = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const orgId = auth?.orgId as string;
    if (!orgId) {
      throw new Error("organization id not found");
    }
    // Get all report IDs that are already assigned to any organization
    const assignedReportIds = new Set(
      (await ctx.db.query("reportAssignments").collect()).map((a) =>
        a.reportId.toString(),
      ),
    );

    const result = await ctx.db
      .query("reports")
      .filter((q) => q.eq(q.field("isSpam"), false))
      .order("desc")
      .collect();

    // Filter out reports that are already assigned
    return result.filter((r) => !assignedReportIds.has(r._id.toString()));
  },
});

export const takeReport = mutation({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const orgId = auth?.orgId as string;
    if (!orgId) {
      throw new Error("organization id not found");
    }

    // Check if report exists
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("report not found");
    }

    // Check if report is already assigned
    const existingAssignment = await ctx.db
      .query("reportAssignments")
      .filter((q) => q.eq(q.field("reportId"), args.reportId))
      .first();
    if (existingAssignment) {
      throw new Error("report is already assigned");
    }

    // Create assignment
    const assignmentId = await ctx.db.insert("reportAssignments", {
      reportId: args.reportId,
      organizationId: orgId,
      similarityScore: 0,
      status: "accepted",
    });

    return assignmentId;
  },
});

export const getReportsByOrganization = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const orgId = auth?.orgId as string;
    if (!orgId) {
      throw new Error("organization id not found");
    }

    // Get all assignments for this organization
    const assignments = await ctx.db
      .query("reportAssignments")
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .collect();

    // Get all reports for these assignments
    const reportsWithAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const report = await ctx.db.get(assignment.reportId);
        return {
          ...report,
          assignmentStatus: assignment.status,
          similarityScore: assignment.similarityScore,
        };
      }),
    );

    return reportsWithAssignments.filter((r) => r !== null && r !== undefined);
  },
});

export const updateReportStatus = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.union(v.literal("pending"), v.literal("resolved")),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const orgId = auth?.orgId as string;
    if (!orgId) {
      throw new Error("organization id not found");
    }

    // Check if report exists
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("report not found");
    }

    // Check if this organization has this report assigned
    const assignment = await ctx.db
      .query("reportAssignments")
      .filter((q) => q.eq(q.field("reportId"), args.reportId))
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .first();
    if (!assignment) {
      throw new Error("report not assigned to your organization");
    }

    // Update report status
    await ctx.db.patch(args.reportId, {
      status: args.status,
    });

    return args.reportId;
  },
});
