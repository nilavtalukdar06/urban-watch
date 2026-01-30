import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export const checkPaymentStatus = query({
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
      .query("organization")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
    return result;
  },
});

export const saveKeys = mutation({
  args: {
    keyName: v.string(),
    publicKeyPrefix: v.string(),
    secretKeyPrefix: v.string(),
    webhookSecretPreix: v.string(),
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
    const organization = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
    if (!organization) {
      throw new Error("organization doesn't exist");
    }
    const keys = await ctx.db
      .query("apiKeys")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
    if (keys) {
      throw new Error(
        "keys already exist, delete the previous ones if you want new",
      );
    }
    await ctx.db.insert("apiKeys", {
      keyName: args.keyName,
      provider: "stripe",
      publicKeyPrefix: args.publicKeyPrefix,
      secretKeyPrefix: args.secretKeyPrefix,
      webhookSecretPrefix: args.webhookSecretPreix,
      organizationId,
      userId: auth.subject,
    });
    const result = await ctx.db.patch(
      "organization",
      organization?._id as Id<"organization">,
      { payments_enabled: true },
    );
    return result;
  },
});

export const retriveKeys = query({
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
    const keys = await ctx.db
      .query("apiKeys")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .collect();
    return keys;
  },
});

export const deleteKeys = mutation({
  args: { apiId: v.id("apiKeys") },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const organizationId = auth?.orgId as string;
    if (!organizationId) {
      throw new Error("organization doesn't exist");
    }
    const organization = await ctx.db
      .query("organization")
      .filter((q) => q.eq(q.field("organizationId"), organizationId))
      .first();
    if (!organization) {
      throw new Error("organization doesn't exist");
    }
    await ctx.db.delete(args.apiId);
    const result = await ctx.db.patch("organization", organization._id, {
      payments_enabled: false,
    });
    return result;
  },
});

export const createCheckout = mutation({
  args: {
    amount: v.number(),
    stripePaymentIntentId: v.string(),
    donatedTo: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const result = await ctx.db.insert("donations", {
      ...args,
      status: "pending",
      donatedBy: auth.subject,
    });
    return result;
  },
});

export const updateDonationStatus = mutation({
  args: {
    stripePaymentIntentId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
    ),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .filter((q) =>
        q.eq(q.field("stripePaymentIntentId"), args.stripePaymentIntentId),
      )
      .first();
    if (!donation) {
      throw new Error("Donation not found");
    }
    await ctx.db.patch(donation._id, {
      status: args.status,
    });
    console.log(`Updated donation ${donation._id} to status: ${args.status}`);
    return { success: true, donationId: donation._id };
  },
});
