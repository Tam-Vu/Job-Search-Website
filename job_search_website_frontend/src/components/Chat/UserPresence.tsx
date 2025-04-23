import { cn } from "@/lib/utils"

type PresenceStatus = "online" | "away" | "busy" | "offline" | "dnd" | "meeting"

interface UserPresenceProps {
  status: PresenceStatus
  className?: string
}

export const UserPresence = ({ status, className }: UserPresenceProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-red-500"
      case "meeting":
        return "bg-purple-500"
      case "dnd":
        return "bg-red-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
      default:
        return "bg-gray-400"
    }
  }

  return (
    <span
      className={cn("h-3 w-3 rounded-full border-2 border-white", getStatusColor(), className)}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    />
  )
}
