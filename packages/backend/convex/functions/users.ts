import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    fullName: v.string(),
    dateOfBirth: v.string(),
    phoneNumber: v.string(),
    permanentAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const result = await ctx.db
      .query("citizens")
      .withIndex("by_userId", (q) => q.eq("userId", auth.subject))
      .first();
    if (result) {
      throw new Error("citizen already exists");
    }
    const citizenId = await ctx.db.insert("citizens", {
      ...args,
      points: 0,
      userId: auth.subject,
      email: auth.email!,
    });
    const identificationId = await ctx.db.insert("userIdentity", {
      isAuthorized: false,
      citizenId,
    });
    return identificationId;
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const users = await ctx.db
      .query("citizens")
      .withIndex("by_points")
      .order("desc")
      .collect();
    return users;
  },
});
