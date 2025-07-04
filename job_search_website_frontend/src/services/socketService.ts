import { io, Socket } from "socket.io-client"
import { Message, Conversation } from "@/apis/chat"

interface SocketEvents {
  onNewMessage: (callback: (data: { conversationId: number; message: Message }) => void) => void
  onNewConversation: (callback: (data: { conversation: Conversation }) => void) => void
  onConversationSeen: (callback: (data: { conversationId: number; seenBy: number }) => void) => void
  onMembersAdded: (callback: (data: { conversationId: number; newMemberIds: number[] }) => void) => void
  onAddedToConversation: (callback: (data: { conversationId: number }) => void) => void
  disconnect: () => void
  onUsersStatusChange: (callback: (usersStatus: Record<string | number, boolean>) => void) => void
  onUserConnected: (callback: (userId: string | number) => void) => void
  onUserDisconnected: (callback: (userId: string | number) => void) => void
}

class SocketService {
  private socket: Socket | null = null
  private connected: boolean = false

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io("http://localhost:8080", {
        auth: {
          token,
        },
        transports: ["websocket"],
        reconnection: true,
      })

      this.socket.on("connect", () => {
        console.log("Socket connected")
        this.connected = true
        resolve()
      })

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error)
        reject(error)
      })

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected")
        this.connected = false
      })
    })
  }

  isConnected(): boolean {
    return this.connected && this.socket !== null
  }

  getSocket(): Socket | null {
    return this.socket
  }

  getEvents(): SocketEvents | null {
    console.log("getEvents", this.socket)
    if (!this.socket) return null

    return {
      onNewMessage: (callback) => {
        this.socket?.on("new_message", callback)
      },
      onNewConversation: (callback) => {
        this.socket?.on("new_conversation", callback)
      },
      onConversationSeen: (callback) => {
        this.socket?.on("conversation_seen", callback)
      },
      onMembersAdded: (callback) => {
        this.socket?.on("members_added", callback)
      },
      onAddedToConversation: (callback) => {
        this.socket?.on("added_to_conversation", callback)
      },
      disconnect: () => {
        this.socket?.disconnect()
        this.connected = false
      },
      onUsersStatusChange: (callback) => {
        this.socket?.on("users:status", callback)
      },
      onUserConnected: (callback) => {
        this.socket?.on("user:connected", callback)
      },
      onUserDisconnected: (callback) => {
        this.socket?.on("user:disconnected", callback)
      },
    }
  }

  // Gửi tin nhắn qua socket
  sendMessage(conversationId: number, text: string): void {
    if (this.socket && this.connected) {
      this.socket.emit("send_message", { conversationId, text })
    }
  }

  // Đánh dấu đã đọc
  markAsSeen(conversationId: number): void {
    if (this.socket && this.connected) {
      this.socket.emit("mark_seen", { conversationId })
    }
  }

  // Tạo cuộc trò chuyện mới
  createConversation(receiverId: number, name?: string, isGroup: boolean = false, members: number[] = []): void {
    if (this.socket && this.connected) {
      this.socket.emit("create_conversation", { receiverId, name, isGroup, members })
    }
  }

  // Lấy tin nhắn của cuộc trò chuyện
  getMessages(conversationId: number): void {
    if (this.socket && this.connected) {
      this.socket.emit("get_messages", { conversationId })
    }
  }

  // Lấy danh sách cuộc trò chuyện
  getConversations(): void {
    if (this.socket && this.connected) {
      this.socket.emit("get_conversations")
    }
  }

  // Cập nhật trạng thái người dùng trực tuyến
  emitUserOnline() {
    const userId = localStorage.getItem("id")
    console.log("Emitting user online status for userId:", userId)
    if (userId) {
      this.socket?.emit("user:online", { userId: parseInt(userId) })
    }
  }
}

export const socketService = new SocketService()
