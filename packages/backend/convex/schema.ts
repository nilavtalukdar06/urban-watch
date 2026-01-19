import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  citizens: defineTable({
    fullName: v.string(),
    dateOfBirth: v.string(),
    phoneNumber: v.string(),
    permanentAddress: v.string(),
    userId: v.string(),
  }).index("by_userId", ["userId"]),
  userIdentity: defineTable({
    isAuthorized: v.boolean(),
    documentType: v.optional(v.string()),
    citizenId: v.id("citizens"),
  }).index("by_citizenId", ["citizenId"]),
  chatbot: defineTable({
    role: v.string(),
    content: v.string(),
    userId: v.string(),
  }).index("by_userId", ["userId"]),
});
