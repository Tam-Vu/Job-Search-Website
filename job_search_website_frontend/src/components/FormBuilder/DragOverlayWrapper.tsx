import { Active, DragOverlay, useDndMonitor, DragStartEvent } from "@dnd-kit/core"
import { useState } from "react"

import { SidebarButtonDragOverlay } from "./DesignerSidebar/SidebarButtonElement"
import useDesigner from "@/hooks/useDesigner"
import { ElementsType, FormElements } from "@/type/designer"

const DragOverlayWrapper = () => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null)
  const { elements } = useDesigner()

  useDndMonitor({
    onDragStart: (event: DragStartEvent) => {
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
        <div className="pointer pointer-events-none flex h-[120px] w-full rounded-md border bg-blue-500 px-4 py-2 opacity-80">
          <DesignerElementComponent elementInstance={element} />
        </div>
      )
    }
  }

  return <DragOverlay
      dropAnimation={null}
      modifiers={[
        // This centers the overlay at the cursor position
        ({ transform }) => {
          return {
            ...transform,
            x: transform.x - 220, // Half the width of your button (120px/2)
            y: transform.y + 50, // Half the height of your button (120px/2)
          }
        }
      ]}
    >{node}</DragOverlay>
}

export default DragOverlayWrapper
