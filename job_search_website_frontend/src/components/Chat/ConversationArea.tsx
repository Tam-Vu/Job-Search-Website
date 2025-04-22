import { useState, useRef, useEffect } from "react"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Phone, Video, Info, Paperclip, Send, Image, FileType, Smile, MessageSquare, Users } from "lucide-react"
import { UserPresence } from "./UserPresence"
import { MessageItem } from "./MessageItem"
import { FilePreview } from "./FilePreview"

// Message type definition
interface Message {
  id: string;
  sender: "other" | "me";
  senderName?: string;
  content: string;
  timestamp: string;
  avatar?: null | string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }[];
}

// Placeholder data for messages
const initialMessageData: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      sender: "other",
      senderName: "John Smith",
      content: "Hi there! I wanted to discuss the software developer position.",
      timestamp: "10:30 AM",
      avatar: null,
    },
    {
      id: "m2",
      sender: "me",
      content: "Hello John! Sure, I'd be happy to discuss that role with you.",
      timestamp: "10:32 AM",
    },
    {
      id: "m3",
      sender: "other",
      senderName: "John Smith",
      content: "When would be a good time for an interview?",
      timestamp: "10:33 AM",
      avatar: null,
    },
  ],
  "2": [
    {
      id: "m4",
      sender: "other",
      senderName: "Sarah from Marketing",
      content: "We need to review those applications by tomorrow.",
      timestamp: "Yesterday",
      avatar: null,
    },
    {
      id: "m5",
      sender: "other",
      senderName: "Michael",
      content: "I'll have them ready by end of day.",
      timestamp: "Yesterday",
      avatar: null,
    },
    {
      id: "m6",
      sender: "me",
      content: "Great, I'll schedule a meeting for review.",
      timestamp: "Yesterday",
    },
  ],
  "3": [
    {
      id: "m7",
      sender: "other",
      senderName: "Emily Johnson",
      content: "I've sent the resume for review",
      timestamp: "Monday",
      avatar: null,
    },
    {
      id: "m8",
      sender: "me",
      content: "Got it, I'll take a look and get back to you shortly.",
      timestamp: "Monday",
    },
  ],
}

// Placeholder data for conversation info
const conversationInfo = {
  "1": { name: "John Smith", status: "online", avatar: null, isGroup: false },
  "2": { name: "Marketing Team", status: "away", avatar: null, isGroup: true, members: 5 },
  "3": { name: "Emily Johnson", status: "busy", avatar: null, isGroup: false },
}

interface ConversationAreaProps {
  conversationId: string | null
}

export const ConversationArea = ({ conversationId }: ConversationAreaProps) => {
  const [message, setMessage] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [messageData, setMessageData] = useState(initialMessageData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when messages change or conversation changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [conversationId, selectedFiles, messageData])

  const handleSendMessage = () => {
    if (message.trim() || selectedFiles.length > 0) {
      if (conversationId) {
        // Generate a unique ID for the new message
        const newMessageId = `m${Date.now()}`;
        
        // Process files into attachments
        const attachments = selectedFiles.map(file => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
          size: file.size
        }));
        
        // Create the new message object
        const newMessage: Message = {
          id: newMessageId,
          sender: "me",
          content: message.trim(),
          timestamp: formatTimestamp(new Date()),
          attachments: attachments.length > 0 ? attachments : undefined
        };
        
        // Add message to the existing conversation
        setMessageData(prevData => ({
          ...prevData,
          [conversationId]: [...(prevData[conversationId as keyof typeof prevData] || []), newMessage],
        }));
        
        // Here you would send the message and files to your backend API
        console.log("Sending message:", message);
        console.log("Sending files:", selectedFiles);
      }
      
      // Clear the input and files
      setMessage("");
      setSelectedFiles([]);
    }
  }

  // Format timestamp for new messages
  const formatTimestamp = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleFilePreview = (file: File) => {
    // Return preview for file
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  if (!conversationId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MessageSquare size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">Your messages</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a conversation or start a new one
          </p>
        </div>
      </div>
    )
  }

  const conversation = conversationInfo[conversationId as keyof typeof conversationInfo]
  const messages = messageData[conversationId as keyof typeof messageData] || []

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center">
          <div className="relative mr-3">
            {conversation.isGroup ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <Users size={20} />
              </div>
            ) : (
              <img
                src={conversation.avatar || "https://via.placeholder.com/40"}
                alt={conversation.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            {!conversation.isGroup && (
              <UserPresence
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                status={conversation.status as any}
                className="absolute -bottom-1 -right-1"
              />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium">{conversation.name}</h3>
            {conversation.isGroup ? (
              <p className="text-xs text-gray-500">{(conversation as {members?: number}).members?.toString()} members</p>
            ) : (
              <p className="text-xs text-gray-500">
                {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Phone size={18} className="text-gray-600" />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Video size={18} className="text-gray-600" />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Info size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => {
            // Calculate showAvatar once using direct index
            const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
            return (
              <MessageItem
                key={msg.id}
                message={msg}
                isGroup={conversation.isGroup}
                showAvatar={showAvatar}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* File previews */}
      {selectedFiles.length > 0 && (
        <div className="border-t p-2 space-y-2">
          <div className="text-sm font-medium">Attachments ({selectedFiles.length})</div>
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
        <div className="flex rounded-md border bg-white">
          <div className="flex items-center pl-3">
            <button
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Smile size={18} />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            className="flex-1 py-2.5 px-3 text-sm focus:outline-none"
          />
          <button
            className="p-3 text-navTitle hover:bg-gray-100"
            onClick={handleSendMessage}
            disabled={!message.trim() && selectedFiles.length === 0}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
