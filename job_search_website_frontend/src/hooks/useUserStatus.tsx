import { useState, useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "./useAuth"

export const useUserStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({})
  const [socket, setSocket] = useState<Socket | null>(null)
  const { isLoggedIn, user } = useAuth()

  useEffect(() => {
    if (!isLoggedIn || !user) return

    // Kết nối socket đến server
    const socketInstance = io(import.meta.env.VITE_API_URL)
    setSocket(socketInstance)

    // Khi kết nối thành công, gửi thông tin đăng nhập
    socketInstance.on("connect", () => {
      socketInstance.emit("user:online", { userId: user.DT.id })
    })

    // Lắng nghe sự kiện cập nhật trạng thái online
    socketInstance.on("users:status", (users: Record<string, boolean>) => {
      setOnlineUsers(users)
    })

    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [isLoggedIn, user])

  const getUserStatus = (userId: string | number): "online" | "offline" => {
    return onlineUsers[userId] ? "online" : "offline"
  }

  return { getUserStatus, onlineUsers }
}
