import { useEffect } from "react"
import { ChatLayout } from "@/components/Chat/ChatLayout"
import { ChatSidebar } from "@/components/Chat/ChatSidebar"
import { ConversationArea } from "@/components/Chat/ConversationArea"
import { useAuth } from "@/hooks/useAuth"
import { ChatProvider } from "@/services/chatContext"

export const Chat = () => {
  const { isLoggedIn } = useAuth()
  // Fetch conversations when component mounts
  useEffect(() => {
    if (isLoggedIn) {
      // Here you would fetch conversations from your API
      // For now we'll use placeholder data
    }
  }, [isLoggedIn])

  return (
    <ChatProvider>
      <ChatLayout>
        <ChatSidebar />
        <ConversationArea />
      </ChatLayout>
    </ChatProvider>
  )
}
