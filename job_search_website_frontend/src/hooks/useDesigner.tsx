import { useContext } from "react"

import { DesignerContext, DesignerContextType } from "@/config/contextDesigner/DesignerContext"

const useDesigner = (): DesignerContextType => {
  const context = useContext(DesignerContext)

  if (!context) {
    throw new Error("useDesigner must be used within a DesignerContextProvider")
  }
  return context
}

export default useDesigner
