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
      deleted: false,
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
    const enhanced = await Promise.all(
      msgs.map(async m => {
        if (m.fileId) {
          const url = await ctx.storage.getUrl(m.fileId);
          return { ...m, fileUrl: url };
        }
        return m;
      })
    );
    return enhanced;
  },
});

export const getUnreadCounts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const convos = await ctx.db
      .query("conversations")
      .withIndex("by_updatedAt")
      .order("desc")
      .collect();
    const mine = convos.filter(c => c.members.includes(userId));
    const result: { conversationId: string; count: number }[] = [];
    for (const c of mine) {
      const msgs = await ctx.db
        .query("messages")
        .withIndex("by_conversationId", q => q.eq("conversationId", c._id))
        .collect();
      const count = msgs.reduce((acc, m) => (m.readBy.includes(userId) ? acc : acc + 1), 0);
      result.push({ conversationId: c._id, count });
    }
    return result;
  },
});

export const markConversationRead = mutation({
  args: { conversationId: v.id("conversations"), userId: v.id("users") },
  handler: async (ctx, { conversationId, userId }) => {
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", q => q.eq("conversationId", conversationId))
      .collect();
    for (const m of msgs) {
      if (!m.readBy.includes(userId)) {
        await ctx.db.patch(m._id, { readBy: [...m.readBy, userId] });
      }
    }
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id("messages"), userId: v.id("users") },
  handler: async (ctx, { messageId, userId }) => {
    const msg = await ctx.db.get(messageId);
    if (!msg) return;
    if (msg.senderId !== userId) {
      throw new Error("Cannot delete another user's message");
    }
    if (msg.deleted) return;
    await ctx.db.patch(messageId, { deleted: true });
    // Update lastMessage preview if necessary
    const conversationId = msg.conversationId;
    const convo = await ctx.db.get(conversationId);
    if (!convo) return;
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", q => q.eq("conversationId", conversationId))
      .order("desc")
      .collect();
    const firstNotDeleted = msgs.find(m => !m.deleted);
    let preview = "Message deleted";
    if (firstNotDeleted) {
      if (firstNotDeleted.fileType) {
        preview = firstNotDeleted.fileName || "Sent a file";
      } else {
        preview = firstNotDeleted.content;
      }
    }
    await ctx.db.patch(conversationId, { lastMessage: preview });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const url = await ctx.storage.generateUploadUrl();
    return url;
  },
});

export const sendFileMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    fileId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(), // "image" | "pdf"
  },
  handler: async (ctx, { conversationId, senderId, fileId, fileName, fileType }) => {
    const convo = await ctx.db.get(conversationId);
    if (!convo) throw new Error("Conversation not found");
    if (!convo.members.includes(senderId)) throw new Error("Not a member of this conversation");

    const createdAt = Date.now();
    const msgId = await ctx.db.insert("messages", {
      conversationId,
      senderId,
      content: "",
      createdAt,
      readBy: [senderId],
      deleted: false,
      fileId,
      fileName,
      fileType,
    });
    const preview = fileName || "Sent a file";
    await ctx.db.patch(conversationId, {
      lastMessage: preview,
      updatedAt: createdAt,
    });
    return msgId;
  },
});
