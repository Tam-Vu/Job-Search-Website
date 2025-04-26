import chatService from "../services/chatService";
import fileService from "../services/fileService";

class ChatController {
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
}

module.exports = new ChatController();
