import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Conversation, Message, User } from "@/apis/chat"
import chatApi from "@/apis/chat"
import { socketService } from "@/services/socketService"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { userApi } from "@/apis"

interface ChatContextType {
  conversations: Conversation[]
  activeConversation: Conversation | null
  messages: Message[]
  users: User[]
  loadingConversations: boolean
  loadingMessages: boolean

  onlineUsers: Record<string | number, boolean>
  isUserOnline: (userId: string | number) => boolean

  setActiveConversationById: (conversationId: number | null) => void
  sendMessage: (text: string, file?: File) => Promise<void>
  createConversation: (
    receiverId: number,
    name?: string,
    isGroup?: boolean,
    members?: number[],
  ) => Promise<Conversation | undefined>
  markAsSeen: () => Promise<void>
  refreshConversations: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined) as React.Context<ChatContextType | undefined>

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth()
  const userId = localStorage.getItem("id")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Record<string | number, boolean>>({})

  const { data: getUser, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => userApi.getAllEmployer(),
    enabled: isLoggedIn,
  })
  console.log("getUser", getUser)

  // Kết nối socket khi đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("accessToken")
      console.log("token", token)
      if (token) {
        socketService
          .connect(token)
          .then(() => {
            socketService.emitUserOnline()
            // Đăng ký các socket event listeners
            setupSocketListeners()
            // Lấy danh sách cuộc trò chuyện ban đầu
            refreshConversations()
          })
          .catch((error) => {
            console.error("Failed to connect socket:", error)
          })
      }
      if (!isLoading) {
        const employerDt = getUser?.DT
        console.log("employerDt", employerDt)
        const users = employerDt?.map((user) => {
          return {
            id: user.userId,
            fullName: user.companyName,
            email: `${user.companyName}@gmail.com`,
          }
        })
        setUsers(users || [])
      }
    }

    return () => {
      if (socketService.isConnected()) {
        socketService.getEvents()?.disconnect()
      }
    }
  }, [getUser?.DT, isLoading, isLoggedIn])

  const setupSocketListeners = () => {
    console.log("events")
    const events = socketService.getEvents()
    if (!events) return

    events.onNewMessage((data) => {
      // Cập nhật tin nhắn nếu đang trong cuộc trò chuyện
      if (activeConversation?.id === data.conversationId) {
        setMessages((prev) => [...prev, data.message])
        markAsSeen() // Tự động đánh dấu đã đọc khi nhận tin nhắn mới trong cuộc trò chuyện hiện tại
      }

      // Cập nhật tin nhắn mới nhất trong danh sách cuộc trò chuyện
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === data.conversationId
            ? {
                ...conv,
                lastMessage: data.message.text,
                status: parseInt(userId ?? "") !== data.message.senderId ? "unseen" : "seen",
              }
            : conv,
        ),
      )
    })

    events.onNewConversation(() => {
      refreshConversations()
    })

    events.onConversationSeen((data) => {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === data.conversationId ? { ...conv, status: "seen" } : conv)),
      )
    })

    events.onMembersAdded(() => {
      refreshConversations()
    })

    events.onAddedToConversation(() => {
      refreshConversations()
    })

    events.onUsersStatusChange((usersStatus) => {
      setOnlineUsers(usersStatus)
    })

    // Khi có người dùng online mới
    events.onUserConnected((userId) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: true }))
    })

    // Khi người dùng offline
    events.onUserDisconnected((userId) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: false }))
    })
  }

  const refreshConversations = async () => {
    if (!isLoggedIn) return

    setLoadingConversations(true)
    try {
      console.log("Fetching conversations...")
      const response = await chatApi.getConversations()
      console.log("Conversations", response)
      if (response.EC === 0 && response.DT) {
        setConversations(response.DT)

        // Nếu đang trong một cuộc trò chuyện, cập nhật thông tin mới
        if (activeConversation) {
          const updated = response.DT.find((c) => c.id === activeConversation.id)
          if (updated) {
            setActiveConversation(updated)
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setLoadingConversations(false)
    }
  }

  const loadMessages = async (conversationId: number) => {
    setLoadingMessages(true)
    try {
      const response = await chatApi.getMessages(conversationId)
      if (response.EC === 0 && response.DT) {
        setMessages(response.DT)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const setActiveConversationById = (conversationId: number | null) => {
    if (!conversationId) {
      setActiveConversation(null)
      setMessages([])
      return
    }

    const conversation = conversations.find((conv) => conv.id === conversationId)
    if (conversation) {
      setActiveConversation(conversation)
      loadMessages(conversationId)

      // Đánh dấu đã đọc khi chuyển cuộc trò chuyện
      if (conversation.status === "unseen") {
        markAsSeen()
      }
    }
  }

  const sendMessage = async (text: string, file?: File) => {
    if (!activeConversation) return

    try {
      const response = await chatApi.sendMessage(activeConversation.id, text, file)
      if (response.EC === 0 && response.DT) {
        // Không cần cập nhật UI vì sẽ nhận được thông báo từ socket
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      throw error
    }
  }

  const createConversation = async (
    receiverId: number,
    name?: string,
    isGroup: boolean = false,
    members: number[] = [],
  ) => {
    try {
      const response = await chatApi.createConversation(receiverId, name, isGroup, members)
      if (response.EC === 0 && response.DT) {
        await refreshConversations()
        return response.DT
      }
    } catch (error) {
      console.error("Failed to create conversation:", error)
      throw error
    }
  }

  const markAsSeen = async () => {
    if (!activeConversation) return

    try {
      const response = await chatApi.markAsSeen(activeConversation.id)
      if (response.EC === 0) {
        setConversations((prev) =>
          prev.map((conv) => (conv.id === activeConversation.id ? { ...conv, status: "seen" } : conv)),
        )
      }
    } catch (error) {
      console.error("Failed to mark as seen:", error)
    }
  }

  const isUserOnline = (userId: string | number): boolean => {
    console.log("onlineUsers", onlineUsers, userId)
    return !!onlineUsers[userId]
  }

  const value = {
    conversations,
    activeConversation,
    messages,
    users,
    loadingConversations,
    loadingMessages,
    onlineUsers,
    isUserOnline,

    setActiveConversationById,
    sendMessage,
    createConversation,
    markAsSeen,
    refreshConversations,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
