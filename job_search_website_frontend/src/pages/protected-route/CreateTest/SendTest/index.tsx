/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/shared/dialog"
import { Button } from "@/components/shared/Button"
import { Search, X, UserPlus, Video } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import DefaultUser from "@/assets/DefaultUser.png"
import { createTest } from "@/apis"
import { toast } from "react-toastify"

// Định nghĩa interface cho User
interface User {
  id: number
  fullName: string
  userId: number
  user: {
    email: string
    image: string | null
  }
}

interface ChannelManagementProps {
  id: number
  onClose: () => void
  isVideoCall?: boolean
}

export const SendTest = ({ id, onClose, isVideoCall = false }: ChannelManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  console.log("selectedMembers", selectedMembers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch danh sách ứng viên từ API
  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee"],
    queryFn: () => createTest.getEmployeeToAssign(),
    refetchOnMount: true,
  })
  console.log("employee", employee)

  const users = employee?.DT ?? []
  console.log("users", users)

  const handleAddMember = (user: User) => {
    if (!selectedMembers.some((member) => member.id === user.id)) {
      setSelectedMembers([...selectedMembers, user])
    }
  }

  const handleRemoveMember = (userId: string | number) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== userId))
  }

  const handleCreateOrUpdate = async () => {
    if (selectedMembers.length === 0) {
      setError("Vui lòng chọn ít nhất một ứng viên")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (isVideoCall) {
        await createTest.inviteMeeting(selectedMembers.map((member) => member.id))
        window.open("/video-call", "_blank")
      } else {
        await createTest.assignTest(
          id.toString(),
          selectedMembers.map((member) => member.id),
        )
      }
      toast.success("Đã thêm ứng viên thành công!")
      // Reset form
      setSelectedMembers([])
      setSearchQuery("")
      onClose()
    } catch (err) {
      setError("Không thể thêm ứng viên. Vui lòng thử lại.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const search = searchQuery.toLowerCase()
    return (
      (user.fullName?.toLowerCase() || "").includes(search) || (user.user.email?.toLowerCase() || "").includes(search)
    )
  })

  return (
    <Dialog key={id} open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <h2 className="text-lg font-semibold text-black">
            {isVideoCall ? "Thêm người phỏng vấn" : "Thêm người làm bài test"}
          </h2>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Thêm ứng viên</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm ứng viên"
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
                    <span className="mr-1 text-gray-500">{member.fullName || member.user.email}</span>
                    <Button
                      onClick={() => handleRemoveMember(member.id)}
                      className="flex !h-5 !w-5 items-center justify-center rounded-full text-white transition-colors hover:text-red-500"
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
            <h3 className="mb-2 text-sm font-medium text-gray-700">ứng viên hiện có</h3>
            {isLoading ? (
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
                          src={user.user?.image || DefaultUser}
                          alt={user.fullName}
                          className="mr-3 h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-black">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.user.email}</p>
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
                    {searchQuery ? "Không tìm thấy ứng viên" : "Tất cả ứng viên đã được thêm vào nhóm"}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            className="text-black hover:bg-slate-300"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreateOrUpdate}
            disabled={loading || selectedMembers.length === 0}
            className="inline-flex items-center text-white"
            type="button"
          >
            {loading ? (
              <>Đang xử lý...</>
            ) : isVideoCall ? (
              <>
                <Video className="mr-2 h-4 w-4 text-white" />
                Bắt đầu phòng họp
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4 text-white" />
                Thêm ứng viên
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
