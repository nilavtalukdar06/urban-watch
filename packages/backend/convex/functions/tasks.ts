import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    dueDate: v.number(),
    assignedToUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const orgId = auth?.orgId as string;
    if (!orgId) {
      throw new Error("organization doesn't exist");
    }
    const role = auth?.orgRole as string;
    if (role.includes("member")) {
      throw new Error("members are not allowed to create task");
    }
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      status: "pending",
      assignedByUserId: auth.subject,
      organizationId: orgId,
    });
    return taskId;
  },
});

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const orgId = auth?.orgId;
    if (!orgId) {
      throw new Error("organization doesn't exist");
    }
    const result = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .order("asc")
      .collect();
    return result;
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const organizationId = auth?.orgId;
    const role = auth?.orgRole as string;
    if (!organizationId) {
      throw new Error("organization doesn't exist");
    }
    if (role.includes("memeber")) {
      throw new Error("a member cannot delete task");
    }
    await ctx.db.delete(args.taskId);
  },
});
