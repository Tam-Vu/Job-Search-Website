import { Root } from "@radix-ui/react-separator"
import { Button } from "@/components/shared/Button"
import { X } from "lucide-react"

import useDesigner from "@/hooks/useDesigner"
import { FormElementInstance, FormElements } from "@/type/designer"

const PropertiesFormSidebar = () => {
  const { selectedElement, setSelectedElement } = useDesigner()
  if (!selectedElement) return null

  if (!selectedElement?.type) {
    throw new Error("Element type is required")
  }

  const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent

  return (
    <div className="flex flex-col p-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-black">Chỉnh sửa</p>
        <Button
          className="h-8 w-8"
          onClick={() => {
            setSelectedElement(null)
          }}
        >
          <X className="" />
        </Button>
      </div>
      <Root className="my-2" />
      <PropertiesForm elementInstance={selectedElement as FormElementInstance} />
    </div>
  )
}

export default PropertiesFormSidebar
