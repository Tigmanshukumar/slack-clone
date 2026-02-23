import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  },
  handler: async (ctx, { messageId, userId, emoji }) => {
    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_messageId_userId_emoji", q =>
        q.eq("messageId", messageId).eq("userId", userId).eq("emoji", emoji)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return;
    }
    await ctx.db.insert("reactions", {
      messageId,
      userId,
      emoji,
      createdAt: Date.now(),
    });
  },
});

export const getReactionsForConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", q => q.eq("conversationId", conversationId))
      .collect();
    const result: { messageId: string; userId: string; emoji: string }[] = [];
    for (const m of msgs) {
      const rs = await ctx.db
        .query("reactions")
        .withIndex("by_messageId", q => q.eq("messageId", m._id))
        .collect();
      for (const r of rs) {
        result.push({ messageId: r.messageId, userId: r.userId, emoji: r.emoji });
      }
    }
    return result;
  },
});

