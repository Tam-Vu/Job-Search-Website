import db from "../models";
import { Op } from "sequelize";

class ChatService {
  // Create a conversation (1-1 or group)
  async createConversation(userId, receiverId, name, isGroup, members = []) {
    try {
      // For 1-1 chat, check if conversation already exists
      if (!isGroup) {
        const existingConversation = await db.conversations.findOne({
          include: [
            {
              model: db.groupmembers,
              where: { userId },
            },
            {
              model: db.groupmembers,
              where: { userId: receiverId },
            },
          ],
          where: { type: "individual" },
        });

        if (existingConversation) {
          return {
            EM: "Conversation already exists",
            EC: 0,
            DT: existingConversation,
          };
        }
      }

      // For individual conversations, get the receiver's name to use as conversation name
      let conversationName = name;
      if (!isGroup) {
        const receiver = await db.users.findByPk(receiverId, {
          attributes: ["fullName", "email"],
        });
        
        if (receiver) {
          // Use fullName if available, otherwise fall back to email
          conversationName = receiver.fullName || receiver.email;
        }
      }

      // Create a new conversation
      const conversation = await db.conversations.create({
        name: conversationName,
        type: isGroup ? "group" : "individual",
        status: "unseen",
      });

      // Add members to the conversation
      const memberList = isGroup ? [userId, ...members] : [userId, receiverId];
      const groupMembers = memberList.map((memberId) => ({
        conversationId: conversation.id,
        userId: memberId,
      }));

      await db.groupmembers.bulkCreate(groupMembers);

      return {
        EM: "Conversation created successfully",
        EC: 0,
        DT: conversation,
      };
    } catch (error) {
      console.error("Error creating conversation:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: null,
      };
    }
  }

  // Add members to an existing conversation
  async addMembersToConversation(conversationId, memberIds) {
    try {
      // Check if conversation exists and is a group
      const conversation = await db.conversations.findOne({
        where: { 
          id: conversationId,
          type: "group" 
        },
      });

      if (!conversation) {
        return {
          EM: "Conversation not found or not a group chat",
          EC: 1,
          DT: null,
        };
      }

      // Check which members are already in the conversation
      const existingMembers = await db.groupmembers.findAll({
        where: {
          conversationId,
          userId: { [Op.in]: memberIds },
        },
      });

      const existingMemberIds = existingMembers.map(member => member.userId);
      const newMemberIds = memberIds.filter(id => !existingMemberIds.includes(id));

      // Add new members
      if (newMemberIds.length > 0) {
        const groupMembers = newMemberIds.map((memberId) => ({
          conversationId,
          userId: memberId,
        }));

        await db.groupmembers.bulkCreate(groupMembers);
      }

      return {
        EM: "Members added successfully",
        EC: 0,
        DT: {
          added: newMemberIds,
          alreadyInGroup: existingMemberIds
        },
      };
    } catch (error) {
      console.error("Error adding members:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: null,
      };
    }
  }

  // Send message to conversation
  async sendMessage(conversationId, senderId, text, file = null) {
    try {
      // Validate required fields
      if (!text) {
        return {
          EM: "Message text is required",
          EC: 1,
          DT: null,
        };
      }

      // Check if sender is part of the conversation
      const isMember = await db.groupmembers.findOne({
        where: {
          conversationId,
          userId: senderId,
        },
      });

      if (!isMember) {
        return {
          EM: "Sender is not part of this conversation",
          EC: 1,
          DT: null,
        };
      }

      // Create message
      const message = await db.messages.create({
        text,
        file,
        conversationId,
        senderId,
      });

      // Update conversation's last message and status
      await db.conversations.update(
        {
          lastMessage: text,
          status: "unseen",
        },
        {
          where: { id: conversationId },
        }
      );

      return {
        EM: "Message sent successfully",
        EC: 0,
        DT: message,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: null,
      };
    }
  }

  // Update conversation status to seen
  async markConversationAsSeen(conversationId, userId) {
    try {
      // Check if user is part of the conversation
      const isMember = await db.groupmembers.findOne({
        where: {
          conversationId,
          userId,
        },
      });

      if (!isMember) {
        return {
          EM: "User is not part of this conversation",
          EC: 1,
          DT: null,
        };
      }

      // Update conversation status
      await db.conversations.update(
        { status: "seen" },
        { where: { id: conversationId } }
      );

      return {
        EM: "Conversation marked as seen",
        EC: 0,
        DT: null,
      };
    } catch (error) {
      console.error("Error marking conversation as seen:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: null,
      };
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId, userId) {
    try {
      // Check if user is part of the conversation
      const isMember = await db.groupmembers.findOne({
        where: {
          conversationId,
          userId,
        },
      });

      if (!isMember) {
        return {
          EM: "User is not part of this conversation",
          EC: 1,
          DT: null,
        };
      }

      const messages = await db.messages.findAll({
        where: { conversationId },
        include: [
          {
            model: db.users,
            attributes: ["id", "fullName", "image"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      return {
        EM: "Messages retrieved successfully",
        EC: 0,
        DT: messages,
      };
    } catch (error) {
      console.error("Error retrieving messages:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: null,
      };
    }
  }

  // Get all conversations for a user
  async getConversations(userId) {
    try {
      const conversations = await db.conversations.findAll({
        include: [
          {
            model: db.groupmembers,
            where: { userId },
            required: true,
          },
          {
            model: db.groupmembers,
            include: [
              {
                model: db.users,
                attributes: ["id", "fullName", "image"],
              },
            ],
          },
          {
            model: db.messages,
            limit: 1,
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: db.users,
                attributes: ["id", "fullName", "image"],
              },
            ],
          },
        ],
        order: [["updatedAt", "DESC"]],
      });

      return {
        EM: "Conversations retrieved successfully",
        EC: 0,
        DT: conversations,
      };
    } catch (error) {
      console.error("Error retrieving conversations:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: null,
      };
    }
  }
}

module.exports = new ChatService();
