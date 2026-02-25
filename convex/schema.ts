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
    isGroup: v.optional(v.boolean()),
    name: v.optional(v.string()),
    lastMessage: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    readBy: v.array(v.id("users")),
    deleted: v.optional(v.boolean()),
    fileId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
  }).index("by_conversationId", ["conversationId"]),
  
  typing: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    updatedAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_conversationId_userId", ["conversationId", "userId"]),
  
  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
    createdAt: v.number(),
  })
    .index("by_messageId", ["messageId"])
    .index("by_messageId_userId_emoji", ["messageId", "userId", "emoji"]),
});
