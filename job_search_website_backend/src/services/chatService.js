import db from "../models/index";

class ChatService {
    async createConversation(name, isGroup, members) {
        const conversation = await db.conversations.create({ name, isGroup });
        if (isGroup) {
        const groupMembers = members.map((userId) => ({
            conversationId: conversation.id,
            userId,
        }));
        await db.groupmembers.bulkCreate(groupMembers);
        }
        return { EM: "Conversation created successfully", EC: 0, DT: conversation };
    }

    async sendMessage(conversationId, senderId, text) {
        const message = await db.Message.create({ conversationId, senderId, text });
        return { EM: "Message sent successfully", EC: 0, DT: message };
    }

    async getMessages(conversationId) {
        const messages = await db.Message.findAll({
        where: { conversationId },
        include: [{ model: db.users }],
        order: [["createdAt", "ASC"]],
        raw: false,
        nest: true,
        });
        return { EM: "Messages retrieved successfully", EC: 0, DT: messages };
    }

    async getConversations(userId) {
        const conversations = await db.conversations.findAll({
        include: [
            {
            model: db.groupmembers,
            where: { userId },
            required: true,
            },
        ],
        raw: false,
        nest: true,
        });
        return { EM: "Conversations retrieved successfully", EC: 0, DT: conversations };
    }
}

module.exports = new ChatService();
