import { raw } from "body-parser";
import db from "../models";
import { Op } from "sequelize";

class ChatService {
  // Create a conversation (1-1 or group)
  async createConversation(userId, receiverId, name, isGroup, members = []) {
    try {
      // For 1-1 chat, check if conversation already exists
      if (!isGroup) {
        // Find a conversation where both users are members through groupmembers
        const existingConversations = await db.conversations.findAll({
          where: { type: "individual" },
          include: [
            {
              model: db.groupmembers,
              where: { userId },
              required: true,
              attributes: ['id']
            }
          ],
          raw: false,
          nest: true
        });
        
        // For each conversation, check if the receiver is a member
        for (const conv of existingConversations) {
          const receiverMembership = await db.groupmembers.findOne({
            where: {
              conversationId: conv.id,
              userId: receiverId
            },
            raw: false,
            nest: true
          });
          
          if (receiverMembership) {
            return {
              EM: "Conversation already exists",
              EC: 0,
              DT: conv,
            };
          }
        }
      }

      // For individual conversations, get the receiver's name to use as conversation name
      let conversationName = name;
      if (!isGroup) {
        const receiver = await db.users.findByPk(receiverId, {
          attributes: ["fullName", "email"],
          raw: false,
          nest: true
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
        raw: false,
        nest: true
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
        raw: false,
        nest: true
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

      // Ensure IDs are integers
      const numConversationId = parseInt(conversationId);
      const numSenderId = parseInt(senderId);
      
      console.log(`Checking membership: conversationId=${numConversationId}, senderId=${numSenderId}`);

      // Check if sender is part of the conversation with a more flexible query
      const isMember = await db.groupmembers.findOne({
        where: {
          conversationId: numConversationId,
          userId: numSenderId,
        },
        raw: false,
        nest: true
      });

      if (!isMember) {
        // Debugging: check if the conversation and user exist separately
        const conversation = await db.conversations.findByPk(numConversationId);
        const user = await db.users.findByPk(numSenderId);
        
        console.log(`Debug - Conversation exists: ${!!conversation}, User exists: ${!!user}`);
        console.log(`User is not a member of conversation ${numConversationId}`);
        
        // Try to find the user's actual conversations for debugging
        const userConversations = await db.groupmembers.findAll({
          where: { userId: numSenderId },
          attributes: ['conversationId'],
          raw: true
        });
        
        console.log(`User ${numSenderId} is member of conversations:`, 
          userConversations.map(c => c.conversationId));
        
        return {
          EM: "Sender is not part of this conversation",
          EC: 1,
          DT: {
            debug: {
              conversationExists: !!conversation,
              userExists: !!user,
              userConversations: userConversations.map(c => c.conversationId)
            }
          },
        };
      }

      // Create message
      const message = await db.messages.create({
        text,
        file,
        conversationId: numConversationId,
        senderId: numSenderId,
      });

      // Update conversation's last message and status
      await db.conversations.update(
        {
          lastMessage: text,
          status: "unseen",
        },
        {
          where: { id: numConversationId },
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
        raw: false,
        nest: true
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
        raw: false,
        nest: true
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
        raw: false,
        nest: true,
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
          // First include: Filter by user membership
          {
            model: db.groupmembers,
            where: { userId },
            required: true,
            attributes: ['id', 'userId', 'conversationId']
          },
          // Second include: Get all members with their user info
          {
            model: db.groupmembers,
            as: 'allMembers', // Add an alias to distinguish from the first include
            required: false,
            attributes: ['id', 'userId', 'conversationId'],
            include: [
              {
                model: db.users,
                attributes: ["id", "fullName", "image"],
              },
            ],
          },
          // Third include: Get latest message
          {
            model: db.messages,
            separate: true, // Use separate queries to avoid duplication
            limit: 1,
            order: [["createdAt", "DESC"]],
            attributes: ['id', 'text', 'file', 'senderId', 'createdAt'],
            include: [
              {
                model: db.users,
                attributes: ["id", "fullName", "image"],
              },
            ],
          },
        ],
        order: [["updatedAt", "DESC"]],
        raw: false,    // Ensure we get model instances
        nest: true     // Properly nest associated models
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

  // Get all members of a conversation
  async getConversationMembers(conversationId) {
    try {
      const members = await db.groupmembers.findAll({
        where: { conversationId },
        raw: false,
        nest: true
      });
      
      return {
        EM: "Conversation members retrieved successfully",
        EC: 0,
        DT: members
      };
    } catch (error) {
      console.error("Error retrieving conversation members:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: null
      };
    }
  }

  // Get all users that can be added to conversations
  async getUsers(currentUserId, searchTerm = null) {
    try {
      let whereCondition = {
        id: { [Op.ne]: currentUserId } // Exclude current user
      };
      
      // Add search functionality if searchTerm is provided
      if (searchTerm) {
        whereCondition = {
          ...whereCondition,
          [Op.or]: [
            { fullName: { [Op.like]: `%${searchTerm}%` } },
            { email: { [Op.like]: `%${searchTerm}%` } }
          ]
        };
      }
      
      const users = await db.users.findAll({
        where: whereCondition,
        attributes: ["id", "fullName", "email", "image"],
        limit: 50, // Limit results to prevent performance issues
        order: [["fullName", "ASC"]], // Sort by name
        raw: false,
        nest: true
      });
      
      return {
        EM: "Users retrieved successfully",
        EC: 0,
        DT: users
      };
    } catch (error) {
      console.error("Error retrieving users:", error);
      return {
        EM: error.message,
        EC: 1,
        DT: null
      };
    }
  }
}

module.exports = new ChatService();
