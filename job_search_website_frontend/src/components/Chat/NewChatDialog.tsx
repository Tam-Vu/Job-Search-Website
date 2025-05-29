import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../shared/dialog"
import { Search, X } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { useChat } from "@/services/chatContext"
import DefaultUser from "@/assets/DefaultUser.png"

interface NewChatDialogProps {
  onClose: () => void
}

export const NewChatDialog = ({ onClose }: NewChatDialogProps) => {
  const { users, createConversation, setActiveConversationById } = useChat()
  const [creating, setCreating] = useState(false)
  const [renderUsers, setRenderUsers] = useState(users)
  const [searchUsers, setSearchUsers] = useState<string | undefined>()

  useEffect(() => {
    const filteredUsers = users.filter((user) =>
      user.fullName.toLowerCase().includes((searchUsers ?? "").toLowerCase()),
    )
    setRenderUsers(filteredUsers)
  }, [searchUsers, users])

  const handleCreateConversation = async (userId: number) => {
    setCreating(true)
    try {
      const conversation = await createConversation(userId)
      console.log("Conersation", conversation)
      if (conversation) {
        setActiveConversationById(conversation.id)
        onClose()
      }
    } catch (error) {
      console.error("Failed to create conversation:", error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="h-fit !max-h-[600px] w-[1200px] overflow-y-auto px-8">
        <DialogHeader>
          <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center rounded-md border px-3 py-2">
            <Search size={18} className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng"
              value={searchUsers}
              onChange={(e) => setSearchUsers(e.target.value)}
              className="w-full bg-transparent text-sm text-black outline-none"
            />
            {searchUsers && (
              <button onClick={() => setSearchUsers("")} className="text-gray-500">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {users.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                {searchUsers ? "Không tìm thấy người dùng" : "Không có người dùng nào"}
              </div>
            ) : (
              <div className="space-y-1">
                {renderUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex cursor-pointer items-center rounded-md p-2 hover:bg-gray-100"
                    onClick={() => handleCreateConversation(user.id)}
                  >
                    <img
                      src={user.image || DefaultUser}
                      alt={user.fullName}
                      className="mr-3 h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-black">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" disabled={creating} onClick={onClose} className="mr-2">
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
