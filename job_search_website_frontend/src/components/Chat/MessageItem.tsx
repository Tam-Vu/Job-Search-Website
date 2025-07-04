import { File as FileIcon, FileText, Image as ImageIcon } from "lucide-react"
import DefaultUser from "@/assets/DefaultUser.png"

interface MessageItemProps {
  message: {
    id: string
    sender: "other" | "me"
    senderName?: string
    content: string
    timestamp: string
    avatar?: null | string
    attachments?: {
      id: string
      name: string
      type: string
      url: string
      size: number
    }[]
  }
  isGroup: boolean
  showAvatar: boolean
}

export const MessageItem = ({ message, isGroup, showAvatar }: MessageItemProps) => {
  const isMe = message.sender === "me"

  const getFileIcon = (type: string) => {
    if (type.match(/^(jpg|jpeg|png|gif|webp|svg)$/i)) {
      return <ImageIcon size={16} className="mr-1" />
    } else if (type.match(/^(txt|doc|docx|pdf)$/i)) {
      return <FileText size={16} className="mr-1" />
    } else {
      return <FileIcon size={16} className="mr-1" />
    }
  }

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} ${
        message.content === "" && !message.attachments?.length ? "hidden" : ""
      }`}
    >
      {!isMe && showAvatar && (
        <div className="mr-2 h-8 w-8 flex-shrink-0">
          <img
            src={message.avatar || DefaultUser}
            alt={message.senderName || "User"}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      )}
      {!isMe && !showAvatar && <div className="mr-2 w-8" />}

      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 ${isMe ? "bg-primary text-white" : "bg-gray-100 text-gray-900"}`}
      >
        {isGroup && !isMe && showAvatar && message.senderName && (
          <div className="mb-1 text-xs font-medium text-blue-600">{message.senderName}</div>
        )}

        {message.content && <div className="whitespace-pre-wrap text-sm">{message.content}</div>}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id}>
                {attachment.type.match(/^(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  // Image attachment
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={attachment.url} alt={attachment.name} className="max-h-60 rounded-lg object-contain" />
                  </a>
                ) : (
                  // Other file type
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center rounded-md border p-2 ${
                      isMe ? "bg-primary-foreground border-white/30" : "border-gray-200 bg-white"
                    }`}
                  >
                    {getFileIcon(attachment.type)}
                    <span className="truncate text-xs">{attachment.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={`mt-1 text-right text-xs ${isMe ? "text-white/70" : "text-gray-500"}`}>{message.timestamp}</div>
      </div>
    </div>
  )
}
