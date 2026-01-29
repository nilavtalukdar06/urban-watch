import { query } from "../_generated/server";

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
