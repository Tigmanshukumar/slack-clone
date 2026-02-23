import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, { conversationId, senderId, content }) => {
    const createdAt = Date.now();
    const msgId = await ctx.db.insert("messages", {
      conversationId,
      senderId,
      content,
      createdAt,
      readBy: [senderId],
    });
    await ctx.db.patch(conversationId, {
      lastMessage: content,
      updatedAt: createdAt,
    });
    return msgId;
  },
});

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", q => q.eq("conversationId", conversationId))
      .order("asc")
      .collect();
    return msgs;
  },
});
