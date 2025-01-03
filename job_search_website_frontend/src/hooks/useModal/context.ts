import { ModalContextType } from "@/type"
import { createContext } from "react"

export const ModalContext = createContext<ModalContextType | undefined>(undefined)
