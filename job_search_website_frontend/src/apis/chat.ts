import { httpClient } from "@/services"
import { Response } from "@/type"

export interface Conversation {
  id: number
  name: string
  type: "group" | "individual"
  status: "seen" | "unseen"
  lastMessage?: string | null
  groupmembers: GroupMember[]
  messages?: Message[]
  updatedAt: string
  allMembers: User[]
}

interface ConversationRes extends Response {
  DT: Conversation
}

interface ListConversationRes extends Response {
  DT: Conversation[]
}

export interface GroupMember {
  id: number
  userId: number
  conversationId: number
  user?: User
}

export interface User {
  id: number
  fullName: string
  email: string
  image?: string | null
}

export interface Message {
  id: number
  text: string
  file?: string | null
  senderId: number
  conversationId: number
  createdAt: string
  user?: User
}

interface MessageRes extends Response {
  DT: Message[]
}

interface UserRes extends Response {
  DT: User[]
}

interface GroupMemberRes extends Response {
  DT: GroupMember[]
}

interface MessageRes extends Response {
  DT: Message[]
}

export interface ApiResponse<T> {
  EM: string
  EC: number
  DT: T
}

class ChatApi {
  constructor() {
    // httpClient.createAuthRefreshInterceptor(() => {
    //   this.logOut()
    //   window.location.href = AUTH_PATH_NAME.DANG_NHAP
    // })
  }

  // 1. Lấy danh sách cuộc trò chuyện
  async getConversations() {
    const response = await httpClient.get<ListConversationRes>("/chat/conversations")
    console.log("response", response)
    return response
  }

  // 2. Lấy tin nhắn của một cuộc trò chuyện
  async getMessages(conversationId: number) {
    const response = await httpClient.get<MessageRes>(`/chat/conversations/${conversationId}/messages`)
    return response
  }

  // 3. Lấy danh sách người dùng
  async getUsers(search?: string) {
    const params = search ? { search } : {}
    const response = await httpClient.get<UserRes>("/chat/users", { params })
    return response
  }

  // 4. Tạo cuộc trò chuyện mới
  async createConversation(receiverId: number, name?: string, isGroup: boolean = false, members: number[] = []) {
    const response = await httpClient.post<ConversationRes>("/chat/conversations", {
      receiverId,
      name,
      isGroup,
      members,
    })
    return response
  }

  // 5. Gửi tin nhắn
  async sendMessage(conversationId: number, text: string, file?: File) {
    const formData = new FormData()
    formData.append("text", text)
    if (file) {
      formData.append("file", file)
    }

    const response = await httpClient.post<MessageRes>(`/chat/conversations/${conversationId}/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response
  }

  // 6. Đánh dấu đã đọc
  async markAsSeen(conversationId: number): Promise<ApiResponse<null>> {
    const response = await httpClient.patch<{ data: ApiResponse<null> }>(`/chat/conversations/${conversationId}/seen`)
    return response.data
  }

  // 7. Tạo nhóm chat
  async createGroupChat(name: string, members: (string | number)[]): Promise<ApiResponse<Conversation>> {
    const response = await httpClient.post<{ data: ApiResponse<Conversation> }>("/conversations", {
      name,
      isGroup: true,
      members,
      receiverId: members[0], // API yêu cầu receiverId, nhưng với group chat chỉ là placeholder
    })
    return response.data
  }

  // 8. Thêm thành viên vào nhóm chat
  async addMembersToGroup(conversationId: string | number, members: (string | number)[]) {
    const response = await httpClient.post<GroupMemberRes>(`/chat/conversations/${conversationId}/members`, {
      members,
    })
    return response
  }
}

const chatApi = new ChatApi()
export default chatApi
