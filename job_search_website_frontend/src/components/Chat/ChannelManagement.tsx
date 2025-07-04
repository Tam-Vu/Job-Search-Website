/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/shared/dialog"
import { Button } from "@/components/shared/Button"
import { Search, X, UserPlus, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import DefaultUser from "@/assets/DefaultUser.png"
import { chatApi } from "@/apis"

// Định nghĩa interface cho User
interface User {
  id: string | number
  name?: string
  fullName?: string
  email?: string
  avatar?: string | null
  image?: string | null
}

// Định nghĩa interface cho Channel/Group Chat
interface Channel {
  id: string | number
  lastMessage?: string | null
  name: string
  allMembers: User[]
  type: "group" | "individual"
  status: "seen" | "unseen"
  updatedAt: string
}

interface ChannelManagementProps {
  open: boolean
  onClose: () => void
  onCreateChannel: (name: string, members: User[]) => Promise<void>
  existingChannel: Channel | null
  onAddMembers: (channelId: string | number, members: User[]) => Promise<void>
}

export const ChannelManagement = ({
  open,
  onClose,
  onCreateChannel,
  existingChannel = null,
  onAddMembers,
}: ChannelManagementProps) => {
  const [channelName, setChannelName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  console.log("selectedMembers", selectedMembers)
  const [isAddingToExisting, setIsAddingToExisting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch danh sách người dùng từ API
  const { data, isLoading: loadingUsers } = useQuery({
    queryKey: ["chatUsers", searchQuery],
    queryFn: () => chatApi.getUsers(searchQuery),
    enabled: open, // Chỉ fetch khi dialog mở
  })

  const users = data?.DT ?? []
  console.log("users", users)

  // Reset form state when dialog opens/closes or when existing channel changes
  useEffect(() => {
    if (open) {
      setError("")

      if (existingChannel) {
        setChannelName(existingChannel.name)
        setIsAddingToExisting(true)
      } else {
        setChannelName("")
        setIsAddingToExisting(false)
      }

      setSelectedMembers([])
      setSearchQuery("")
    }
  }, [open, existingChannel])

  const handleAddMember = (user: User) => {
    if (!selectedMembers.some((member) => member.id === user.id)) {
      setSelectedMembers([...selectedMembers, user])
    }
  }

  const handleRemoveMember = (userId: string | number) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== userId))
  }

  const handleCreateOrUpdate = async () => {
    if (!isAddingToExisting && (!channelName.trim() || selectedMembers.length === 0)) {
      setError("Vui lòng nhập tên nhóm chat và chọn ít nhất một thành viên")
      return
    }

    if (isAddingToExisting && selectedMembers.length === 0) {
      setError("Vui lòng chọn ít nhất một thành viên để thêm vào nhóm")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (isAddingToExisting && existingChannel && onAddMembers) {
        // Adding members to existing group chat
        await onAddMembers(existingChannel.id, selectedMembers)
      } else {
        // Creating new group chat
        await onCreateChannel(channelName, selectedMembers)
      }

      // Reset form
      setChannelName("")
      setSelectedMembers([])
      setSearchQuery("")
      onClose()
    } catch (err) {
      setError("Không thể tạo nhóm chat. Vui lòng thử lại.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter out users that are already in the existing channel
  const availableUsers = users.filter((user) => {
    if (!existingChannel) return true

    // Check if user is already a member of the existing channel
    return !existingChannel.allMembers.some((member) => member.id === user.id)
  })

  const filteredUsers = availableUsers.filter((user) => {
    const search = searchQuery.toLowerCase()
    return (user.fullName?.toLowerCase() || "").includes(search) || (user.email?.toLowerCase() || "").includes(search)
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <h2 className="text-lg font-semibold text-black">
            {isAddingToExisting ? `Thêm thành viên vào ${existingChannel?.name}` : "Tạo nhóm chat mới"}
          </h2>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {!isAddingToExisting && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tên nhóm chat</label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Nhập tên nhóm chat"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isAddingToExisting ? "Thêm thành viên mới" : "Thêm thành viên"}
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {selectedMembers.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Đã chọn</label>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <div key={member.id} className="flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm">
                    <span className="mr-1 text-gray-500">{member.fullName || member.email}</span>
                    <Button
                      onClick={() => handleRemoveMember(member.id)}
                      className="flex !h-5 !w-5 items-center justify-center rounded-full text-white hover:text-red-500"
                      type="button"
                    >
                      <X className="text-xs" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Người dùng hiện có</h3>
            {loadingUsers ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto rounded border">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      className="flex w-full items-center justify-between bg-white p-3 text-left hover:bg-gray-50"
                      onClick={() => handleAddMember(user)}
                      disabled={selectedMembers.some((member) => member.id === user.id)}
                      type="button"
                    >
                      <div className="flex items-center">
                        <img
                          src={user.image || DefaultUser}
                          alt={user.fullName}
                          className="mr-3 h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      {selectedMembers.some((member) => member.id === user.id) ? (
                        <span className="text-sm text-blue-500">Đã chọn</span>
                      ) : (
                        <UserPlus size={16} className="text-gray-400" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    {searchQuery ? "Không tìm thấy người dùng" : "Tất cả người dùng đã được thêm vào nhóm"}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading} type="button">
            Hủy
          </Button>
          <Button
            onClick={handleCreateOrUpdate}
            disabled={
              loading ||
              (isAddingToExisting ? selectedMembers.length === 0 : !channelName.trim() || selectedMembers.length === 0)
            }
            className="inline-flex items-center text-white"
            type="button"
          >
            {loading ? (
              <>Đang xử lý...</>
            ) : isAddingToExisting ? (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm thành viên
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Tạo nhóm chat
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
