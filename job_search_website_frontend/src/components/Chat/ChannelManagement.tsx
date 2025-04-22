import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/shared/dialog"
import { Button } from "@/components/shared/Button"
import { Input } from "@/components/shared/ui/AnimatedHoverInput"
import { Search, X, UserPlus, Users } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar: string | null
}

interface Channel {
  id: string
  name: string
  members: User[]
  isGroup: boolean
}

// Placeholder data
const users: User[] = [
  { id: "1", name: "John Smith", email: "john@example.com", avatar: null },
  { id: "2", name: "Emily Johnson", email: "emily@example.com", avatar: null },
  { id: "3", name: "Michael Brown", email: "michael@example.com", avatar: null },
  { id: "4", name: "Sarah Davis", email: "sarah@example.com", avatar: null },
]

interface ChannelManagementProps {
  open: boolean
  onClose: () => void
  onCreateChannel: (name: string, members: User[]) => void
  existingChannel?: Channel | null
  onAddMembers?: (channelId: string, members: User[]) => void
}

export const ChannelManagement = ({ 
  open, 
  onClose, 
  onCreateChannel, 
  existingChannel = null,
  onAddMembers 
}: ChannelManagementProps) => {
  const [channelName, setChannelName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  const [isAddingToExisting, setIsAddingToExisting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
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

  const handleRemoveMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== userId))
  }

  const handleCreateOrUpdate = async () => {
    if (!isAddingToExisting && (!channelName.trim() || selectedMembers.length === 0)) {
      setError("Please provide a channel name and select at least one member")
      return
    }
    
    if (isAddingToExisting && selectedMembers.length === 0) {
      setError("Please select at least one member to add")
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
      setError("Failed to create group chat. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter out users that are already in the existing channel
  const availableUsers = users.filter(user => {
    if (!existingChannel) return true
    
    // Check if user is already a member of the existing channel
    return !existingChannel.members.some(member => member.id === user.id)
  })
  
  const filteredUsers = availableUsers.filter(user => {
    const search = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <h2 className="text-lg font-semibold">
            {isAddingToExisting ? `Add Members to ${existingChannel?.name}` : "Create New Group Chat"}
          </h2>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {!isAddingToExisting && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Group Chat Name</label>
              <Input
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Enter group chat name"
                className="w-full"
              />
            </div>
          )}
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {isAddingToExisting ? "Add New Members" : "Add Members"}
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search people"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {selectedMembers.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Selected Members</label>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm"
                  >
                    <span className="mr-1">{member.name}</span>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="rounded-full hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Available People</h3>
            <div className="max-h-40 overflow-y-auto rounded border">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    className="flex w-full items-center justify-between border-b p-3 text-left hover:bg-gray-50"
                    onClick={() => handleAddMember(user)}
                    disabled={selectedMembers.some((member) => member.id === user.id)}
                  >
                    <div className="flex items-center">
                      <img
                        src={user.avatar || "https://via.placeholder.com/32"}
                        alt={user.name}
                        className="mr-3 h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    {selectedMembers.some((member) => member.id === user.id) ? (
                      <span className="text-sm text-blue-500">Added</span>
                    ) : (
                      <UserPlus size={16} className="text-gray-400" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  {searchQuery ? "No matching users found" : "All available users are already in this group"}
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrUpdate}
            disabled={loading || (isAddingToExisting ? selectedMembers.length === 0 : !channelName.trim() || selectedMembers.length === 0)}
            className="inline-flex items-center"
          >
            {loading ? (
              <>Loading...</>
            ) : isAddingToExisting ? (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Members
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Create Group Chat
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
