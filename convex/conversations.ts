import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or get a 1:1 conversation between two users
export const createOrGetConversation = mutation({
  args: { userAId: v.id("users"), userBId: v.id("users") },
  handler: async (ctx, { userAId, userBId }) => {
    const all = await ctx.db.query("conversations").collect();
    const found = all.find(
      c => !c.isGroup && c.members.includes(userAId) && c.members.includes(userBId)
    );
    if (found) return found._id;
    const id = await ctx.db.insert("conversations", {
      members: [userAId, userBId],
      isGroup: false,
      name: undefined,
      lastMessage: undefined,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// ── Pin a message ──
export const pinMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, { conversationId, messageId, userId }) => {
    const convo = await ctx.db.get(conversationId);
    if (!convo) return;
    if (!convo.members.includes(userId)) {
      throw new Error("Not a member of this conversation");
    }

    const current = convo.pinnedMessageIds || [];

    // prevent duplicates
    if (current.includes(messageId)) return;

    // cap at 5 pins
    if (current.length >= 5) throw new Error("Max 5 pinned messages");

    await ctx.db.patch(conversationId, {
      pinnedMessageIds: [...current, messageId],
    });
  },
});

// ── Unpin a message ── ✅ was missing entirely
export const unpinMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, { conversationId, messageId, userId }) => {
    const convo = await ctx.db.get(conversationId);
    if (!convo) return;
    if (!convo.members.includes(userId)) {
      throw new Error("Not a member of this conversation");
    }

    const current = convo.pinnedMessageIds || [];
    await ctx.db.patch(conversationId, {
      pinnedMessageIds: current.filter(id => id !== messageId),
    });
  },
});

// Get all conversations ordered by updatedAt
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

// Create Group conversation
export const createGroupConversation = mutation({
  args: { name: v.string(), memberIds: v.array(v.id("users")) },
  handler: async (ctx, { name, memberIds }) => {
    const uniqueMembers = Array.from(new Set(memberIds));
    const id = await ctx.db.insert("conversations", {
      members: uniqueMembers,
      isGroup: true,
      name,
      lastMessage: undefined,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// Delete Group conversation
export const deleteGroupConversation = mutation({
  args: { conversationId: v.id("conversations"), requesterId: v.id("users") },
  handler: async (ctx, { conversationId, requesterId }) => {
    const convo = await ctx.db.get(conversationId);
    if (!convo) return;
    if (!convo.isGroup) {
      throw new Error("Not a group conversation");
    }
    if (!convo.members.includes(requesterId)) {
      throw new Error("Not a member of this group");
    }
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", q => q.eq("conversationId", conversationId))
      .collect();
    for (const m of msgs) {
      const rs = await ctx.db
        // @ts-ignore reactions table exists in schema
        .query("reactions")
        .withIndex("by_messageId", q => q.eq("messageId", m._id))
        .collect();
      for (const r of rs) {
        // @ts-ignore
        await ctx.db.delete(r._id);
      }
      await ctx.db.delete(m._id);
    }
    const typing = await ctx.db
      // @ts-ignore typing table exists in schema
      .query("typing")
      .withIndex("by_conversationId", q => q.eq("conversationId", conversationId))
      .collect();
    for (const t of typing) {
      // @ts-ignore
      await ctx.db.delete(t._id);
    }
    await ctx.db.delete(conversationId);
  },
});