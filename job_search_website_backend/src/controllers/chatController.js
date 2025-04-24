const chatService = require("../services/chatService");

class ChatController {
  async createConversation(req, res) {
    try {
      const { name, isGroup, members } = req.body;
      const response = await chatService.createConversation(name, isGroup, members);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const { text } = req.body;
      const senderId = req.user.id;
      const conversationId = req.params.id;
      const response = await chatService.sendMessage(conversationId, senderId, text);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

    async getMessages(req, res) {
        try {
        const conversationId = req.params.id;
        const response = await chatService.getMessages(conversationId);
        return res.status(200).json(response);
        } catch (error) {
        return res.status(500).json({ error: error.message });
        }
    }

    async getConversations(req, res) {
        try {
        const userId = req.user.id;
        const response = await chatService.getConversations(userId);
        return res.status(200).json(response);
        } catch (error) {
        return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ChatController();
