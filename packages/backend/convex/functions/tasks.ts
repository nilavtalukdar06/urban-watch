import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    dueDate: v.number(),
    assignedToUserId: v.string(),
    assigneeName: v.string(),
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

export const fetchUserTasks = query({
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
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("assignedToUserId"), auth.subject),
          q.eq(q.field("organizationId"), organizationId),
        ),
      )
      .order("desc")
      .collect();
    return result;
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
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
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("task not found");
    }
    if (task.organizationId !== organizationId) {
      throw new Error("task doesn't belong to this organization");
    }
    if (task.assignedToUserId !== auth.subject) {
      throw new Error("task status can only be updated by the assignee");
    }
    if (task.status === args.status) {
      return {
        success: true,
        taskId: args.taskId,
        status: args.status,
      };
    }
    await ctx.db.patch(args.taskId, {
      status: args.status,
    });
    return {
      success: true,
      taskId: args.taskId,
      status: args.status,
    };
  },
});
