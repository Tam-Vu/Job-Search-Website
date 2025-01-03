import { useContext } from "react"
import { ModalContext } from "./context"
import { ModalContextType } from "@/type"

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
