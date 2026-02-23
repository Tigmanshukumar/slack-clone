import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, { conversationId, userId }) => {
    const existing = await ctx.db
      .query("typing")
      .withIndex("by_conversationId_userId", q =>
        q.eq("conversationId", conversationId).eq("userId", userId)
      )
      .unique();
    const now = Date.now();
    if (!existing) {
      await ctx.db.insert("typing", { conversationId, userId, updatedAt: now });
    } else {
      await ctx.db.patch(existing._id, { updatedAt: now });
    }
  },
});

export const getTyping = query({
  args: {
    conversationId: v.id("conversations"),
    excludeUserId: v.id("users"),
    now: v.number(),
  },
  handler: async (ctx, { conversationId, excludeUserId, now }) => {
    const items = await ctx.db
      .query("typing")
      .withIndex("by_conversationId", q => q.eq("conversationId", conversationId))
      .collect();
    const THRESHOLD = 2000;
    const active = items.filter(
      t => t.userId !== excludeUserId && now - t.updatedAt < THRESHOLD
    );
    return active.map(t => t.userId);
  },
});
