/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Search, Plus, MessageSquare, Users, UserPlus } from "lucide-react"
import { UserPresence } from "@/components/Chat/UserPresence"
import { NewChatDialog } from "@/components/Chat/NewChatDialog"
import { GroupChatManager } from "./GroupChatManager"
import { useChat } from "@/services/chatContext"
import { useAuth } from "@/hooks/useAuth"
import DefaultUser from "@/assets/DefaultUser.png"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/apis"
import { ChannelManagement } from "./ChannelManagement"
import { useMutation } from "@tanstack/react-query"
import { chatApi } from "@/apis" // Tạo file API này nếu chưa có
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"
interface User {
  id: string | number
  name?: string
  fullName?: string
  email?: string
  avatar?: string | null
  image?: string | null
}

export const ChatSidebar = () => {
  const { isLoggedIn } = useAuth()
  const { data: user } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => authApi.currentUser(),
    enabled: isLoggedIn,
  })
  const { conversations, loadingConversations, setActiveConversationById, activeConversation, refreshConversations } =
    useChat()
  console.log("conversations", conversations)
  const [activeTab, setActiveTab] = useState<"chats" | "contacts" | "settings">("chats")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)

  // Thêm state cho nhóm chat đang được chọn
  const [selectedGroupChat, setSelectedGroupChat] = useState<any>(null)

  // Lọc cuộc trò chuyện theo từ khóa tìm kiếm
  const filteredConversations = conversations.filter((conversation) => {
    // Tìm tên cuộc trò chuyện hoặc nội dung tin nhắn cuối cùng
    const conversationName = conversation.name.toLowerCase()
    const lastMessage = conversation.lastMessage?.toLowerCase() || ""
    const query = searchQuery.toLowerCase()

    return conversationName.includes(query) || lastMessage.includes(query)
  })

  // Hiển thị tên cuộc trò chuyện 1-1 là tên của người nhận
  const getConversationName = (conversation: any) => {
    if (conversation.type === "group") return conversation.name

    // Nếu là cuộc trò chuyện 1-1, tìm thành viên khác
    const otherMember = conversation.groupmembers?.find((member: any) => member.userId !== user?.DT.id && member.user)

    return otherMember && otherMember.user ? otherMember.user.fullName : conversation.name
  }

  // Lấy avatar của cuộc trò chuyện
  const getConversationAvatar = (conversation: any) => {
    if (conversation.type === "group") return null

    const otherMember = conversation.groupmembers?.find((member: any) => member.userId !== user?.DT.id && member.user)

    return otherMember && otherMember.user && otherMember.user.image ? otherMember.user.image : null
  }

  // Format thời gian cuối cùng
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      })
    } catch (e) {
      return ""
    }
  }

  // Mutation để tạo nhóm chat
  const createGroupMutation = useMutation({
    mutationFn: ({ name, members }: { name: string; members: any[] }) => {
      // Chuyển đổi format members từ array User sang array userId
      const memberIds = members.map((member) => member.id)
      return chatApi.createGroupChat(name, memberIds)
    },
    onSuccess: (data: { DT?: { id: number } }) => {
      toast.success("Đã tạo nhóm chat mới")
      refreshConversations() // Cập nhật danh sách cuộc trò chuyện
      if (data.DT && data.DT.id) {
        setActiveConversationById(data.DT.id) // Chọn cuộc trò chuyện mới tạo
      }
    },
    onError: (error) => {
      console.error("Failed to create group chat:", error)
      toast.error("Không thể tạo nhóm chat. Vui lòng thử lại sau.")
    },
  })

  // Mutation để thêm thành viên vào nhóm
  const addMembersMutation = useMutation({
    mutationFn: ({ groupId, members }: { groupId: string; members: any[] }) => {
      // Chuyển đổi format members từ array User sang array userId
      const memberIds = members.map((member) => member.id)
      return chatApi.addMembersToGroup(groupId, memberIds)
    },
    onSuccess: () => {
      toast.success("Đã thêm thành viên vào nhóm chat")
      refreshConversations() // Cập nhật danh sách cuộc trò chuyện
    },
    onError: (error) => {
      console.error("Failed to add members:", error)
      toast.error("Không thể thêm thành viên. Vui lòng thử lại sau.")
    },
  })

  // Xử lý tạo nhóm chat
  const handleCreate = async (name: string, members: any[]) => {
    createGroupMutation.mutate({ name, members })
  }

  // Xử lý thêm thành viên vào nhóm chat
  const handleAddMembers = async (channelId: string | number, members: User[]) => {
    addMembersMutation.mutate({ groupId: channelId.toString(), members })
  }

  return (
    <div className="flex h-full w-80 flex-col border-r">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Chat</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewChatDialog(true)}
              className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
            >
              <UserPlus size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => setShowCreateGroupDialog(true)}
              className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 flex items-center rounded-md bg-gray-100 px-3 py-2">
          <Search size={18} className="mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 border-b px-2 py-3">
        <button
          onClick={() => setActiveTab("chats")}
          className={cn(
            "flex flex-1 items-center justify-center space-x-1 border-b-2 py-3 text-sm",
            activeTab === "chats"
              ? "border-sky-500 bg-sky-100 text-sky-700"
              : "border-transparent bg-gray-100 text-gray-500 hover:text-gray-700",
          )}
        >
          <MessageSquare size={16} />
          <span>Chats</span>
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={cn(
            "flex flex-1 items-center justify-center space-x-1 border-b-2 py-3 text-sm",
            activeTab === "contacts"
              ? "border-sky-500 bg-sky-100 text-sky-700"
              : "border-transparent bg-gray-100 text-gray-500 hover:text-gray-700",
          )}
        >
          <Users size={16} />
          <span>Contacts</span>
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "chats" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
              <h3 className="text-xs font-medium text-gray-500">RECENT CHATS</h3>
            </div>
            {loadingConversations ? (
              <div className="flex justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Không có cuộc trò chuyện nào</div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex cursor-pointer items-center border-b p-3 hover:bg-gray-50 ${
                    activeConversation?.id === conversation.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setActiveConversationById(conversation.id)}
                >
                  <div className="relative mr-3">
                    {conversation.type === "group" ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <Users size={20} />
                      </div>
                    ) : (
                      <img
                        src={getConversationAvatar(conversation) || DefaultUser}
                        alt={getConversationName(conversation)}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    {conversation.type !== "group" && (
                      <UserPresence status="online" className="absolute -bottom-1 -right-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{getConversationName(conversation)}</h3>
                      {conversation.messages && conversation.messages.length > 0 && (
                        <span className="text-xs text-gray-500">{formatTime(conversation.messages[0].createdAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="max-w-[180px] truncate text-sm text-gray-500">
                        {conversation.lastMessage || "Không có tin nhắn"}
                      </p>
                      {conversation.status === "unseen" && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "contacts" && <GroupChatManager />}
      </div>

      {/* Dialogs */}
      {showCreateGroupDialog && (
        <ChannelManagement
          onCreateChannel={handleCreate}
          existingChannel={selectedGroupChat}
          onAddMembers={handleAddMembers}
          open={showCreateGroupDialog}
          onClose={() => {
            setShowCreateGroupDialog(false)
            setSelectedGroupChat(null) // Reset selected group when closing
          }}
        />
      )}

      {showNewChatDialog && <NewChatDialog onClose={() => setShowNewChatDialog(false)} />}
    </div>
  )
}
