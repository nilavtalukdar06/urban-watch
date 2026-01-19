import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createMessage = mutation({
  args: {
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) {
      throw new Error("the user is not authenticated");
    }
    const messageId = await ctx.db.insert("chatbot", {
      ...args,
      userId: auth.subject,
    });
    return messageId;
  },
});

export const createAImessage = mutation({
  args: {
    role: v.string(),
    content: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("chatbot", { ...args });
    return messageId;
  },
});
