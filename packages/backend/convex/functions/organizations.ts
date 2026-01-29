import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const createOrganization = mutation({
  args: {
    name: v.string(),
    purpose: v.string(),
    goal: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const organizationId = auth?.orgId as string;
    if (!organizationId) {
      throw new Error("not a valid organization");
    }
    const result = await ctx.db.insert("organization", {
      ...args,
      organizationId,
      payments_enabled: false,
      userId: auth.subject,
    });
    return result;
  },
});

export const getOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authneticated");
    }
    const result = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("payments_enabled"), true))
      .collect();
    return result;
  },
});
