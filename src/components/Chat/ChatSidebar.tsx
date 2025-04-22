/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Search, Users, MessageSquare, Settings, Plus, UserPlus } from "lucide-react"
import { UserPresence } from "./UserPresence"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shared/Button"
import { ChannelManagement } from "./ChannelManagement"
import DefaultUser from "@/assets/DefaultUser.png"

// Placeholder data
const recentChats = [
  {
    id: "1",
    name: "John Smith",
    lastMessage: "When will the interview start?",
    time: "10:30 AM",
    unread: 2,
    avatar: null,
    status: "online",
  },
  {
    id: "2",
    name: "Marketing Team",
    lastMessage: "We need to review those applications",
    time: "Yesterday",
    unread: 0,
    avatar: null,
    status: "away",
    isGroup: true,
  },
  {
    id: "3",
    name: "Emily Johnson",
    lastMessage: "I've sent the resume for review",
    time: "Monday",
    unread: 0,
    avatar: null,
    status: "busy",
  },
]

interface ChatSidebarProps {
  onSelectConversation: (id: string) => void
  activeConversation: string | null
}

export const ChatSidebar = ({ onSelectConversation, activeConversation }: ChatSidebarProps) => {
  const [activeTab, setActiveTab] = useState<"chats" | "contacts" | "settings">("chats")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false)
  const [selectedGroupChat, setSelectedGroupChat] = useState<any>(null)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)

  const handleCreateGroupChat = (name: string, members: any[]) => {
    // Here you would call your API to create a group chat
    console.log("Creating group chat:", name, members)
    // After success, you might want to refresh the chat list
  }

  const handleAddMembers = (channelId: string, members: any[]) => {
    // Here you would call your API to add members to an existing group
    console.log("Adding members to group:", channelId, members)
    // After success, you might want to refresh the chat list
  }

  const openAddMembersDialog = (chat: any) => {
    setSelectedGroupChat(chat)
    setShowCreateGroupDialog(true)
  }

  const handleStartNewChat = () => {
    // Open dialog to select a user to chat with
    setShowNewChatDialog(true)
  }

  return (
    <div className="flex w-80 flex-col border-r">
      {/* Profile section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={DefaultUser}
              className="h-10 w-10 rounded-full object-cover"
              alt="Profile"
            />
            <UserPresence status="online" className="absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-black">Current User</h3>
            <p className="text-xs text-gray-500">Available</p>
          </div>
        </div>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Settings size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Search bar */}
      <div className="mx-2 mb-2 mt-1">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-md border border-gray-300 text-black bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b px-2 gap-2">
        <button
          onClick={() => setActiveTab("chats")}
          className={cn(
            "flex flex-1 items-center justify-center space-x-1 border-b-2 py-3 text-sm",
            activeTab === "chats"
              ? "border-navTitle text-navTitle"
              : "border-transparent text-gray-500 hover:text-gray-700",
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
              ? "border-navTitle text-navTitle"
              : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          <Users size={16} />
          <span>Contacts</span>
        </button>
      </div>

      {/* Create Group Chat Button */}
      <div className="p-2 border-b">
        <Button
          onClick={() => {
            setSelectedGroupChat(null)
            setShowCreateGroupDialog(true)
          }}
          className="w-full flex items-center justify-center gap-2 bg-navTitle text-white"
        >
          <Users size={16} />
          <span>Create Group Chat</span>
        </Button>
      </div>

      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "chats" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
              <h3 className="text-xs font-medium text-gray-500">RECENT CHATS</h3>
              <button 
                className="rounded p-1 hover:bg-gray-100"
                onClick={handleStartNewChat}
                title="Start new conversation"
              >
                <Plus size={16} className="text-gray-500" />
              </button>
            </div>
            {recentChats.map((chat) => (
              <div key={chat.id} className="relative group">
                <button
                  className={cn(
                    "flex w-full items-start rounded-md px-3 py-2 text-left",
                    activeConversation === chat.id
                      ? "bg-gray-100"
                      : "transition-colors hover:bg-gray-50",
                  )}
                  onClick={() => onSelectConversation(chat.id)}
                >
                  <div className="relative mr-3 mt-1">
                    {chat.isGroup ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <Users size={18} />
                      </div>
                    ) : (
                      <img
                        src={chat.avatar || "https://via.placeholder.com/36"}
                        alt={chat.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    )}
                    {!chat.isGroup && (
                      <UserPresence
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        status={chat.status as any}
                        className="absolute -bottom-1 -right-1"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{chat.name}</h4>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-gray-500">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-navTitle px-1.5 text-xs font-medium text-white">
                      {chat.unread}
                    </span>
                  )}
                </button>

                {/* Add members to group button - only shows on hover for group chats */}
                {chat.isGroup && (
                  <button
                    onClick={() => openAddMembersDialog(chat)}
                    className="absolute right-2 top-2 hidden p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 group-hover:block"
                    title="Add members to group"
                  >
                    <UserPlus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="px-2 py-4 text-center text-sm text-gray-500">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Your contacts will appear here</p>
          </div>
        )}
      </div>

      {/* Group Chat Dialog */}
      <ChannelManagement
        open={showCreateGroupDialog}
        onClose={() => setShowCreateGroupDialog(false)}
        onCreateChannel={handleCreateGroupChat}
        existingChannel={selectedGroupChat}
        onAddMembers={handleAddMembers}
      />

      {/* New Chat Dialog */}
      {showNewChatDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-md p-4 w-80">
            <h3 className="font-medium mb-4">Start New Conversation</h3>
            {/* Contact selector would go here */}
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowNewChatDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                // Logic to start new conversation
                setShowNewChatDialog(false)
              }}>
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
