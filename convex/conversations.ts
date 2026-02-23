import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrGetConversation = mutation({
  args: { userAId: v.id("users"), userBId: v.id("users") },
  handler: async (ctx, { userAId, userBId }) => {
    const all = await ctx.db.query("conversations").collect();
    const found = all.find(
      c => c.members.includes(userAId) && c.members.includes(userBId)
    );
    if (found) return found._id;
    const id = await ctx.db.insert("conversations", {
      members: [userAId, userBId],
      lastMessage: undefined,
      updatedAt: Date.now(),
    });
    return id;
  },
});

export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const list = await ctx.db
      .query("conversations")
      .withIndex("by_updatedAt")
      .order("desc")
      .collect();
    return list.filter(c => c.members.includes(userId));
  },
});
