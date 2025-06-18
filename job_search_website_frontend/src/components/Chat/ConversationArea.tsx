/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react"
import { MessageSquare, Phone, Video, Info, Users, Paperclip, Send, Image as ImageIcon } from "lucide-react"
import { MessageItem } from "@/components/Chat/MessageItem"
import { FilePreview } from "@/components/Chat/FilePreview"
import { useChat } from "@/services/chatContext"
import { User } from "@/apis/chat"
import { UserPresence } from "@/components/Chat/UserPresence"
import DefaultUser from "@/assets/DefaultUser.png"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/apis"

export const ConversationArea = () => {
  const { isLoggedIn } = useAuth()
  const { data: user } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => authApi.currentUser(),
    enabled: isLoggedIn,
  })
  const { activeConversation, messages, sendMessage, loadingMessages } = useChat()
  const [message, setMessage] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeConversation?.id])

  const handleSendMessage = async () => {
    if (message.trim() || selectedFiles.length > 0) {
      try {
        // Chỉ xử lý file đầu tiên (backend hiện chỉ hỗ trợ 1 file)
        const file = selectedFiles.length > 0 ? selectedFiles[0] : undefined
        await sendMessage(message.trim(), file)
        setMessage("")
        setSelectedFiles([])
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      setSelectedFiles([...selectedFiles, ...newFiles])

      // Reset input để có thể chọn lại cùng một file
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file)
    }
    return null
  }

  // Nếu không có cuộc trò chuyện nào được chọn
  if (!activeConversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MessageSquare size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">Tin nhắn của bạn</h3>
          <p className="mt-1 text-sm text-gray-500">Chọn một cuộc trò chuyện hoặc bắt đầu cuộc trò chuyện mới</p>
        </div>
      </div>
    )
  }

  // Lấy thông tin hiển thị cho người dùng trong cuộc trò chuyện 1-1
  const getOtherUser = (): User | null => {
    if (activeConversation.type === "individual") {
      const otherMember = activeConversation.groupmembers?.find(
        (member: any) => member.userId !== user?.DT.id && member.user,
      )
      return otherMember?.user || null
    }
    return null
  }

  const getConversationName = () => {
    if (activeConversation.type === "group") return activeConversation.name
    const otherUser = getOtherUser()
    return otherUser?.fullName || activeConversation.name
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center">
          <div className="relative mr-3">
            {activeConversation.type === "group" ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <Users size={20} />
              </div>
            ) : (
              <img
                src={getOtherUser()?.image || DefaultUser}
                alt={getConversationName()}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            {activeConversation.type !== "group" && (
              <UserPresence status="online" className="absolute -bottom-1 -right-1" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-black">{getConversationName()}</h3>
            {activeConversation.type === "group" ? (
              <p className="text-xs text-gray-500">{activeConversation.allMembers?.length || 0} thành viên</p>
            ) : (
              <p className="text-xs text-gray-500">Trực tuyến</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-lg font-medium text-gray-500">Không có tin nhắn nào</div>
            <p className="mt-2 text-gray-400">Hãy bắt đầu cuộc trò chuyện</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              // Calculate showAvatar once using direct index
              const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId

              return (
                <MessageItem
                  key={msg.id}
                  message={{
                    id: msg.id.toString(),
                    sender: msg.senderId === user?.DT.id ? "me" : "other",
                    senderName: msg.user?.fullName,
                    content: msg.text,
                    timestamp: new Date(msg.createdAt).toLocaleTimeString(),
                    avatar: msg.user?.image,
                    attachments: msg.file
                      ? [
                          {
                            id: `file-${msg.id}`,
                            name: msg.file.split("/").pop() || "file",
                            type: msg.file.includes(".")
                              ? msg.file.split(".").pop()?.toLowerCase() || "unknown"
                              : "unknown",
                            url: msg.file,
                            size: 0, // Không có thông tin kích thước từ server
                          },
                        ]
                      : undefined,
                  }}
                  isGroup={activeConversation.type === "group"}
                  showAvatar={showAvatar}
                />
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* File previews */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 border-t p-2">
          <div className="text-sm font-medium">Tệp đính kèm ({selectedFiles.length})</div>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                preview={handleFilePreview(file)}
                onRemove={() => handleRemoveFile(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="border-t p-3">
        <div className="flex gap-1 rounded-md bg-white">
          <div className="flex items-center gap-1 pl-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-gray-200 p-3 text-gray-500 hover:text-gray-700"
            >
              <Paperclip size={18} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
            <button className="rounded-full bg-gray-200 p-3 text-gray-500 hover:text-gray-700">
              <ImageIcon size={18} />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="flex-1 rounded-full bg-gray-200 px-3 py-2.5 text-sm text-black focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="cursor-pointer rounded-full bg-gray-200 p-3 text-navTitle hover:bg-gray-300"
            disabled={!message.trim() && selectedFiles.length === 0}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
