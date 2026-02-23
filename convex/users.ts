import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, { clerkId, name, imageUrl }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", clerkId))
      .unique();
    const now = Date.now();
    if (!existing) {
      const _id = await ctx.db.insert("users", {
        clerkId,
        name,
        imageUrl,
        online: true,
        lastSeen: now,
      });
      return _id;
    } else {
      await ctx.db.patch(existing._id, {
        name,
        imageUrl,
        online: true,
        lastSeen: now,
      });
      return existing._id;
    }
  },
});

export const getUsers = query({
  args: { currentClerkId: v.string() },
  handler: async (ctx, { currentClerkId }) => {
    const all = await ctx.db.query("users").collect();
    return all.filter(u => u.clerkId !== currentClerkId);
  },
});
