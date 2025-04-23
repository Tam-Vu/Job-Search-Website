const db = require("../models");

class ChatService {
  async createConversation(name, isGroup, members) {
    const conversation = await db.Conversation.create({ name, isGroup });
    if (isGroup) {
      const groupMembers = members.map((userId) => ({
        conversationId: conversation.id,
        userId,
      }));
      await db.GroupMember.bulkCreate(groupMembers);
    }
    return { EM: "Conversation created successfully", EC: 0, DT: conversation };
  }

  async sendMessage(conversationId, senderId, text) {
    const message = await db.Message.create({ conversationId, senderId, text });
    return { EM: "Message sent successfully", EC: 0, DT: message };
  }
}

module.exports = new ChatService();
