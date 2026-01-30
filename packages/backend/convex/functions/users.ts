import { mutation, query, action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import axios from "axios";

export const createUser = mutation({
  args: {
    fullName: v.string(),
    dateOfBirth: v.string(),
    phoneNumber: v.string(),
    permanentAddress: v.string(),
    clerkUserId: v.string(),
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

export const checkVerificationStatus = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const citizen = await ctx.db
      .query("citizens")
      .filter((q) => q.eq(q.field("userId"), auth.subject))
      .first();
    if (!citizen) {
      throw new Error("citizen doesn't exist");
    }
    const result = await ctx.db
      .query("userIdentity")
      .filter((q) => q.eq(q.field("citizenId"), citizen._id))
      .first();
    return result;
  },
});

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const result = await ctx.db
      .query("citizens")
      .filter((q) => q.eq(q.field("userId"), auth.subject))
      .first();
    return result;
  },
});

export const getUserById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("citizens")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    return result;
  },
});

export const deleteUsersFromDB = mutation({
  args: {
    userIds: v.array(v.id("citizens")),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) throw new Error("not authenticated");
    const organizationId = auth?.orgId as string;
    if (!organizationId) {
      throw new Error("organization doesn't exist");
    }
    if ((auth.orgRole as string)?.includes("member")) {
      throw new Error("only admin can delete users");
    }
    await Promise.all(args.userIds.map((id) => ctx.db.delete(id)));
    return { deletedCount: args.userIds.length };
  },
});

export const deleteUsers = action({
  args: {
    userIds: v.array(v.id("citizens")),
    clerkIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userIds.length !== args.clerkIds.length) {
      throw new Error("length mismatch");
    }
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const organizationId = auth?.orgId as string;
    if (!organizationId) {
      throw new Error("organization doesn't exist");
    }
    const role = auth?.orgRole as string;
    if (role.includes("member")) {
      throw new Error("only an admin can delete a user");
    }
    await Promise.all(
      args.clerkIds.map(async (clerkId) => {
        await axios.delete(`https://api.clerk.com/v1/users/${clerkId}`, {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
          },
        });
      }),
    );
    await ctx.runMutation(api.functions.users.deleteUsersFromDB, {
      userIds: args.userIds,
    });
    return { deletedCount: args.userIds.length };
  },
});

export const updateUserPoints = mutation({
  args: {
    userId: v.string(),
    points: v.number(),
  },
  handler: async (ctx, args) => {
    const citizen = await ctx.db
      .query("citizens")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (!citizen) {
      throw new Error("citizen not found");
    }
    const newPoints = Math.max(0, citizen.points + args.points);
    await ctx.db.patch(citizen._id, {
      points: newPoints,
    });
    return {
      previousPoints: citizen.points,
      newPoints,
      pointsAdded: args.points,
    };
  },
});
