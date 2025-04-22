import React from "react"

interface ChatLayoutProps {
  children: React.ReactNode
}

export const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden rounded-lg border bg-white shadow-sm">
      {children}
    </div>
  )
}
