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

export const setOnlineStatus = mutation({
  args: {
    clerkId: v.string(),
    online: v.boolean(),
  },
  handler: async (ctx, { clerkId, online }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", clerkId))
      .unique();
    const now = Date.now();
    if (!existing) {
      await ctx.db.insert("users", {
        clerkId,
        name: "User",
        imageUrl: "",
        online,
        lastSeen: now,
      });
      return;
    }
    await ctx.db.patch(existing._id, { online, lastSeen: now });
  },
});

export const getUsers = query({
  args: { currentClerkId: v.string() },
  handler: async (ctx, { currentClerkId }) => {
    const all = await ctx.db.query("users").collect();
    const now = Date.now();
    const THRESHOLD = 30_000;
    return all
      .filter(u => u.clerkId !== currentClerkId)
      .map(u => ({
        ...u,
        online: now - u.lastSeen < THRESHOLD,
      }));
  },
});
