import { FileIcon, ImageIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react"
import DefaultUser from "@/assets/DefaultUser.png"

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

interface MessageItemProps {
  message: {
    id: string;
    sender: "me" | "other";
    senderName?: string;
    content: string;
    timestamp: string;
    avatar?: string | null;
    attachments?: FileAttachment[];
  };
  isGroup: boolean;
  showAvatar: boolean;
}

export const MessageItem = ({ message, isGroup, showAvatar }: MessageItemProps) => {
  const isMe = message.sender === "me";
  
  // Format file size to readable format (KB, MB)
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Determine file icon based on mime type
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (type.includes("spreadsheet") || type.includes("excel")) return <FileSpreadsheetIcon className="h-5 w-5" />;
    if (type.includes("text") || type.includes("pdf") || type.includes("doc")) return <FileTextIcon className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && showAvatar && (
        <div className="mr-2 h-8 w-8 flex-shrink-0">
          <img
            src={DefaultUser}
            alt={message.senderName || "User"}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      )}
      
      <div className={`max-w-[70%] flex-col ${isMe ? "items-end" : "items-start"}`}>
        {isGroup && !isMe && showAvatar && (
          <div className="mb-1 text-xs font-medium text-gray-500">
            {message.senderName}
          </div>
        )}
        
        <div
          className={`rounded-lg px-3 py-2 ${
            isMe 
              ? "bg-blue-500 text-white" 
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message.content && <p className="mb-1">{message.content}</p>}
          
          {/* File attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div key={attachment.id}>
                  {attachment.type.startsWith("image/") ? (
                    // Render image
                    <div className="overflow-hidden rounded-md">
                      <img 
                        src={attachment.url} 
                        alt={attachment.name}
                        className="max-h-[300px] w-auto object-contain"
                      />
                      <div className="text-xs opacity-70">{attachment.name}</div>
                    </div>
                  ) : (
                    // Render other file types
                    <a 
                      href={attachment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center rounded-md p-2 ${
                        isMe ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {getFileIcon(attachment.type)}
                      <div className="ml-2">
                        <div className={`max-w-[200px] truncate text-sm ${isMe ? "text-white" : "text-gray-800"}`}>
                          {attachment.name}
                        </div>
                        <div className={`text-xs ${isMe ? "text-blue-200" : "text-gray-600"}`}>
                          {formatFileSize(attachment.size)}
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-1 text-xs text-gray-500">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
