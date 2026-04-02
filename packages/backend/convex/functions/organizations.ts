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

export const getOrganization = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const organizationId = auth?.orgId as string;
    if (!organizationId) {
      throw new Error("organization doesn't exist");
    }
    const result = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
    return result;
  },
});

export const updateWalletAddress = mutation({
  args: {
    walletAddress: v.string(),
  },
  handler: async (ctx, { walletAddress }) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) throw new Error("Unauthenticated");
    if (!auth.orgId) throw new Error("No organisation context");

    const org = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("organizationId"), auth.orgId))
      .first();

    if (!org) throw new Error("Organisation not found");

    await ctx.db.patch(org._id, { walletAddress });
    return { success: true };
  },
});

export const getOrgWalletAddress = query({
  args: { organizationId: v.string() },
  handler: async (ctx, { organizationId }) => {
    const org = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
    return org?.walletAddress ?? null;
  },
});
