import chatService from "../services/chatService";
import fileService from "../services/fileService";

class ChatSocketController {
  constructor(io) {
    this.io = io;
  }

  // Create a new conversation
  async createConversation(socket, data) {
    try {
      const { receiverId, name, isGroup, members } = data;
      const userId = socket.user.id; // Get user ID from authenticated socket
      
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
      
      // Emit response back to the requesting user
      socket.emit('conversation_created', response);
    } catch (error) {
      console.error("Error in createConversation:", error);
      socket.emit('error', { 
        message: error.message,
        operation: 'create_conversation' 
      });
    }
  }

  // Send a message
  async sendMessage(socket, data) {
    try {
      const { conversationId, text, file } = data;
      const userId = socket.user.id; // Get user ID from authenticated socket
      
      let fileUrl = null;
      if (file) {
        // Handle file upload if included
        // Note: For Socket.IO, you'll need to handle file uploads differently
        // Typically using socket.io-file or a separate endpoint
        fileUrl = await fileService.uploadFile(file);
      }
      
      const response = await chatService.sendMessage(
        conversationId,
        userId,
        text,
        fileUrl
      );
      
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
      
      // Emit response back to the requesting user
      socket.emit('message_sent', response);
    } catch (error) {
      console.error("Error in sendMessage:", error);
      socket.emit('error', { 
        message: error.message,
        operation: 'send_message' 
      });
    }
  }

  // Mark conversation as seen
  async markAsSeen(socket, data) {
    try {
      const { conversationId } = data;
      const userId = socket.user.id; // Get user ID from authenticated socket
      
      const response = await chatService.markConversationAsSeen(conversationId, userId);
      
      if (response.EC === 0) {
        const conversationMembers = await chatService.getConversationMembers(conversationId);
        
        if (conversationMembers.EC === 0) {
          conversationMembers.DT.forEach(member => {
            if (member.userId !== userId) {
              this.io.to(`user_${member.userId}`).emit('conversation_seen', {
                conversationId: parseInt(conversationId),
                seenBy: userId
              });
            }
          });
        }
      }
      
      // Emit response back to the requesting user
      socket.emit('marked_seen', response);
    } catch (error) {
      console.error("Error in markAsSeen:", error);
      socket.emit('error', { 
        message: error.message,
        operation: 'mark_seen' 
      });
    }
  }

  // Get messages for a conversation
  async getMessages(socket, data) {
    try {
      const { conversationId } = data;
      const userId = socket.user.id; // Get user ID from authenticated socket
      
      const response = await chatService.getMessages(conversationId, userId);
      
      // Emit response back to the requesting user
      socket.emit('messages_retrieved', response);
    } catch (error) {
      console.error("Error in getMessages:", error);
      socket.emit('error', { 
        message: error.message,
        operation: 'get_messages' 
      });
    }
  }

  // Get all conversations for the current user
  async getConversations(socket) {
    try {
      const userId = socket.user.id; // Get user ID from authenticated socket
      
      const response = await chatService.getConversations(userId);
      
      // Emit response back to the requesting user
      socket.emit('conversations_retrieved', response);
    } catch (error) {
      console.error("Error in getConversations:", error);
      socket.emit('error', { 
        message: error.message,
        operation: 'get_conversations' 
      });
    }
  }

  // Add members to a conversation
  async addMembersToConversation(socket, data) {
    try {
      const { conversationId, members } = data;
      const userId = socket.user.id; // Get user ID from authenticated socket
      
      if (!conversationId || !members || !members.length) {
        socket.emit('error', {
          message: "Conversation ID and members list are required",
          operation: 'add_members'
        });
        return;
      }
      
      const response = await chatService.addMembersToConversation(
        conversationId,
        members
      );

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
      
      // Emit response back to the requesting user
      socket.emit('members_added_response', response);
    } catch (error) {
      console.error("Error in addMembersToConversation:", error);
      socket.emit('error', { 
        message: error.message,
        operation: 'add_members' 
      });
    }
  }
}

// Export a function that returns a new controller instance with the io object
module.exports = (io) => new ChatSocketController(io);
