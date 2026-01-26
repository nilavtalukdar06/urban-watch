import { mutation } from "../_generated/server";
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
