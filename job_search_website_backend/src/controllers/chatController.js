import chatService from "../services/chatService";
import fileService from "../services/fileService";

class ChatController {
  constructor(io) {
    this.io = io;
  }

  // Create a new conversation
  async createConversation(req, res) {
    try {
      const { receiverId, name, isGroup, members } = req.body;
      const userId = req.user.id;
      
      const response = await chatService.createConversation(
        userId, 
        receiverId, 
        name, 
        isGroup, 
        members
      );
      
      if (response.EC === 0) {
        const conversation = response.DT;
        // Emit event to all participants in the conversation
        const memberIds = isGroup ? [userId, ...members] : [userId, receiverId];
        
        memberIds.forEach(memberId => {
          this.io.to(`user_${memberId}`).emit('new_conversation', {
            conversation: {
              id: conversation.id,
              name: conversation.name,
              type: conversation.type
            }
          });
        });
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in createConversation controller:", error);
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: null 
      });
    }
  }

  // Add members to an existing conversation
  async addMembersToConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const { members } = req.body;
      
      if (!conversationId || !members || !members.length) {
        return res.status(400).json({
          EM: "Conversation ID and members list are required",
          EC: 1,
          DT: null,
        });
      }
      
      const response = await chatService.addMembersToConversation(
        conversationId,
        members
      );

      // After successfully adding members, emit socket event
      if (response.EC === 0) {
        const { added } = response.DT;
        
        // Notify existing members about new members
        const conversationMembers = await chatService.getConversationMembers(conversationId);
        
        if (conversationMembers.EC === 0) {
          conversationMembers.DT.forEach(member => {
            this.io.to(`user_${member.userId}`).emit('members_added', {
              conversationId: parseInt(conversationId),
              newMemberIds: added
            });
          });
          
          // Notify new members they've been added to the conversation
          added.forEach(memberId => {
            this.io.to(`user_${memberId}`).emit('added_to_conversation', {
              conversationId: parseInt(conversationId)
            });
          });
        }
      }
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in addMembersToConversation controller:", error);
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: null 
      });
    }
  }

  // Send a message
  async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { text } = req.body;
      const userId = req.user.id;
      let fileUrl = null;

      // Handle file upload if present
      if (req.file) {
        fileUrl = await fileService.uploadFile(req.file);
      }
      
      const response = await chatService.sendMessage(
        conversationId,
        userId,
        text,
        fileUrl
      );
      
      // If message was sent successfully, notify all users in the conversation
      if (response.EC === 0) {
        const message = response.DT;
        
        // Get all members of this conversation
        const conversationMembers = await chatService.getConversationMembers(conversationId);
        
        if (conversationMembers.EC === 0) {
          // Emit message to each member's socket room
          conversationMembers.DT.forEach(member => {
            this.io.to(`user_${member.userId}`).emit('new_message', {
              conversationId: parseInt(conversationId),
              message: {
                id: message.id,
                text: message.text,
                file: message.file,
                senderId: userId,
                createdAt: message.createdAt
              }
            });
          });
        }
      }
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in sendMessage controller:", error);
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: null 
      });
    }
  }

  // Mark conversation as seen
  async markAsSeen(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;
      
      const response = await chatService.markConversationAsSeen(conversationId, userId);
      
      // If marked as seen successfully, notify other participants
      if (response.EC === 0) {
        const conversationMembers = await chatService.getConversationMembers(conversationId);
        
        if (conversationMembers.EC === 0) {
          conversationMembers.DT.forEach(member => {
            // Don't notify the user who marked the conversation as seen
            if (member.userId !== userId) {
              this.io.to(`user_${member.userId}`).emit('conversation_seen', {
                conversationId: parseInt(conversationId),
                seenBy: userId
              });
            }
          });
        }
      }
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in markAsSeen controller:", error);
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: null 
      });
    }
  }

  // Get all messages for a conversation
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;
      
      const response = await chatService.getMessages(conversationId, userId);
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in getMessages controller:", error);
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: null 
      });
    }
  }

  // Get all conversations for the current user
  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      
      const response = await chatService.getConversations(userId);
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in getConversations controller:", error);
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: null 
      });
    }
  }

  // Get users that can be added to conversations
  async getUsers(req, res) {
    try {
      const userId = req.user.id;
      const { search } = req.query; // Optional search parameter
      
      const response = await chatService.getUsers(userId, search);
      
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in getUsers controller:", error);
      return res.status(500).json({ 
        EM: error.message,
        EC: 1,
        DT: null 
      });
    }
  }
}

// Export a function that returns a new controller instance with the io object
module.exports = (io) => new ChatController(io);
