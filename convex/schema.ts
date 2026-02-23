import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.string(),
    online: v.boolean(),
    lastSeen: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  conversations: defineTable({
    members: v.array(v.id("users")),
    lastMessage: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    readBy: v.array(v.id("users")),
  }).index("by_conversationId", ["conversationId"]),
});
