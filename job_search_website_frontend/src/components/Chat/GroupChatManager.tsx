import { useState, useEffect } from "react"
import { Button } from "@/components/shared/Button"
import { Users, UserPlus, Plus } from "lucide-react"
import { ChannelManagement } from "./ChannelManagement"
import { toast } from "react-toastify"
import { useChat } from "@/services/chatContext"
import { chatApi } from "@/apis"
// import DefaultUser from "@/assets/default-user.png"

// Define types
interface User {
  id: string | number
  name?: string
  fullName?: string
  email?: string
  avatar?: string | null
  image?: string | null
}

interface Channel {
  id: string | number
  lastMessage?: string | null
  name: string
  allMembers: User[]
  type: "group" | "individual"
  status: "seen" | "unseen"
  updatedAt: string
}

export const GroupChatManager = () => {
  const { conversations, refreshConversations, createConversation, setActiveConversationById } = useChat()
  const [groupChats, setGroupChats] = useState<Channel[]>([])
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false)
  const [selectedGroupChat, setSelectedGroupChat] = useState<Channel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  console.log("conversations", conversations)
  // Lọc danh sách các cuộc hội thoại nhóm từ context
  useEffect(() => {
    if (conversations) {
      // Chỉ lấy các cuộc trò chuyện loại "group"
      const groups = conversations.filter((conv) => conv.type === "group")
      setGroupChats(groups)
    }
  }, [conversations])

  // Handle creating a new group chat
  const handleCreateGroupChat = async (name: string, members: User[]) => {
    setIsLoading(true)
    try {
      // Convert members array to the format expected by the API
      const memberIds = members.map((member) => member.id)

      // Gọi API để tạo nhóm chat
      await createConversation(
        memberIds[0] as number, // receiverId (không quan trọng cho group)
        name,
        true, // isGroup = true
        memberIds as number[], // members array
      )

      // Refresh the list of conversations
      await refreshConversations()
      toast.success("Nhóm chat đã được tạo thành công!")
      setShowCreateGroupDialog(false)
    } catch (error) {
      console.error("Failed to create group chat:", error)
      toast.error("Không thể tạo nhóm chat. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle adding members to an existing group
  const handleAddMembersToGroup = async (channelId: string | number, newMembers: User[]) => {
    setIsLoading(true)
    try {
      // Chuyển đổi format members từ array User sang array userId
      const memberIds = newMembers.map((member) => member.id)

      const res = await chatApi.addMembersToGroup(channelId, memberIds)
      console.log("res", res)

      await refreshConversations()
      if (res.EC === 0) {
        toast.success(`Đã thêm ${newMembers.length} thành viên vào nhóm!`)
        setSelectedGroupChat(null)
      } else {
        toast.error(res.EM)
      }
    } catch (error) {
      console.error("Failed to add members to group:", error)
      toast.error("Không thể thêm thành viên. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý khi người dùng muốn thêm thành viên vào một nhóm chat
  const handleAddMembers = (groupChat: Channel) => {
    setSelectedGroupChat(groupChat)
    setShowCreateGroupDialog(true)
  }

  // Xử lý khi người dùng nhấn vào một nhóm chat
  const handleSelectGroup = (groupId: string | number) => {
    setActiveConversationById(groupId as number)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4 pr-0">
        <h2 className="text-lg font-semibold">Nhóm chat</h2>
        <Button
          onClick={() => {
            setSelectedGroupChat(null)
            setShowCreateGroupDialog(true)
          }}
          className="flex items-center gap-1 text-white"
        >
          <Plus className="h-4 w-4" />
          Tạo nhóm
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : groupChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Bạn chưa có nhóm chat nào</div>
        ) : (
          <div>
            {groupChats.map((chat) => (
              <div
                key={chat.id}
                className="flex cursor-pointer items-center justify-between border-b p-3 hover:bg-gray-50"
                onClick={() => handleSelectGroup(chat.id)}
              >
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Users size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">{chat.name}</h3>
                    <p className="text-xs text-gray-500">{chat.allMembers.length} thành viên</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation() // Ngăn event bubble lên đến parent div
                    handleAddMembers(chat)
                  }}
                  className="flex items-center justify-center rounded-full bg-gray-100 p-2 text-blue-500 hover:text-blue-700"
                >
                  <UserPlus size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog để tạo nhóm chat mới hoặc thêm thành viên */}
      {showCreateGroupDialog && (
        <ChannelManagement
          open={showCreateGroupDialog}
          onClose={() => {
            setShowCreateGroupDialog(false)
            setSelectedGroupChat(null)
          }}
          onCreateChannel={handleCreateGroupChat}
          existingChannel={selectedGroupChat}
          onAddMembers={handleAddMembersToGroup}
        />
      )}
    </div>
  )
}
