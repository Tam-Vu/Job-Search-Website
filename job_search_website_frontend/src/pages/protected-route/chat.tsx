import { useState, useEffect } from "react"
import { ChatLayout } from "@/components/Chat/ChatLayout"
import { ChatSidebar } from "@/components/Chat/ChatSidebar"
import { ConversationArea } from "@/components/Chat/ConversationArea"
import { useAuth } from "@/hooks/useAuth"

export const Chat = () => {
  const { isLoggedIn } = useAuth()
  const [activeConversation, setActiveConversation] = useState<string | null>(null)

  // Fetch conversations when component mounts
  useEffect(() => {
    if (isLoggedIn) {
      // Here you would fetch conversations from your API
      // For now we'll use placeholder data
    }
  }, [isLoggedIn])

  return (
    <ChatLayout>
      <ChatSidebar onSelectConversation={setActiveConversation} activeConversation={activeConversation} />
      <ConversationArea conversationId={activeConversation} />
    </ChatLayout>
  )
}
