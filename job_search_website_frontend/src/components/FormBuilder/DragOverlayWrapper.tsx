import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core"
import { useState } from "react"

import { SidebarButtonDragOverlay } from "./DesignerSidebar/SidebarButtonElement"
import useDesigner from "@/hooks/useDesigner"
import { ElementsType, FormElements } from "@/type/designer"

const DragOverlayWrapper = () => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null)
  const { elements } = useDesigner()

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active)
    },
    onDragCancel: () => {
      setDraggedItem(null)
    },
    onDragEnd: () => {
      setDraggedItem(null)
    },
  })
  if (!draggedItem) return null

  let node = <div>No Drag Overlay</div>

  const isSidebarButtonElement = draggedItem.data?.current?.isDraggableButtonElement
  if (isSidebarButtonElement) {
    const type = draggedItem.data?.current?.type as ElementsType
    node = <SidebarButtonDragOverlay formElement={FormElements[type]} />
  }

  const isDesignerElement = draggedItem.data?.current?.isDesignerElement
  if (isDesignerElement) {
    const elementId = draggedItem.data?.current?.elementId
    const element = elements.find((el) => el.id === elementId)
    if (!element) node = <div>Element not found!</div>
    else {
      if (!element.type) {
        throw new Error("Element type is required")
      }
      const DesignerElementComponent = FormElements[element.type].designerComponent

      node = (
        <div className="pointer pointer-events-none flex h-[120px] w-full !touch-none rounded-md border bg-black px-2 py-1 opacity-80">
          <DesignerElementComponent elementInstance={element} />
        </div>
      )
    }
  }
  return (
    <DragOverlay
      dropAnimation={null}
      modifiers={[
        ({ transform }) => {
          // Điều chỉnh vị trí cho phù hợp với con trỏ chuột
          // và thêm offset để overlay nằm dưới góc phải
          return {
            ...transform,
            x: transform.x + 15, // Dịch sang phải 15px
            y: transform.y + 15, // Dịch xuống dưới 15px
          }
        },
      ]}
    >
      {node}
    </DragOverlay>
  )
}

export default DragOverlayWrapper
