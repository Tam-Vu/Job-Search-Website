import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core"
import { Button } from "../shared/Button"
import { TrashIcon } from "lucide-react"
import { useState } from "react"

import useDesigner from "@/hooks/useDesigner"
import { cn } from "@/lib/utils"
import { ElementsType, FormElementInstance, FormElements } from "@/type/designer"
import { idGenerator } from "@/config"

import DesignerSidebar from "./DesignerSidebar/Sidebar"

function Designer() {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement, updateElement } = useDesigner()

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  })

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event
      if (!active || !over) return

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea

      // First scenario
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type
        const newElement = FormElements[type as ElementsType].construct(idGenerator())

        addElement(elements.length, newElement)
        return
      }

      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement

      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement

      const isDroppingOverDesignerElementLefHalf = over.data?.current?.isLeftHalfDesignerElement

      const isDroppingOverDesignerElementRightHalf = over.data?.current?.isRightHalfDesignerElement

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf ||
        isDroppingOverDesignerElementLefHalf ||
        isDroppingOverDesignerElementRightHalf

      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement

      // Second scenario
      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type
        let newElement = FormElements[type as ElementsType].construct(idGenerator())

        const overId = over.data?.current?.elementId

        const overElementIndex = elements.findIndex((el) => el.id === overId)
        if (overElementIndex === -1) {
          throw new Error("element not found")
        }

        let indexForNewElement = overElementIndex
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1
        }
        if (isDroppingOverDesignerElementLefHalf || isDroppingOverDesignerElementRightHalf) {
          const cloneCurrent = { ...elements[overElementIndex] }
          if (!cloneCurrent?.hasSameRow) {
            removeElement(overId)
            const parentId = idGenerator()
            let row: FormElementInstance[] = []
            if (isDroppingOverDesignerElementLefHalf) {
              row = [
                { ...newElement, type: newElement.type as ElementsType, parent: parentId },
                { ...cloneCurrent, type: cloneCurrent.type as ElementsType, parent: parentId },
              ]
            } else if (isDroppingOverDesignerElementRightHalf) {
              row = [
                { ...cloneCurrent, type: cloneCurrent.type as ElementsType, parent: parentId },
                { ...newElement, type: newElement.type as ElementsType, parent: parentId },
              ]
            }
            newElement = {
              id: parentId,
              hasSameRow: true,
              row: row.map((el) => ({ ...el, type: el.type as ElementsType })),
            }
          } else if (cloneCurrent?.hasSameRow) {
            let cloneRow = cloneCurrent.row
            if (isDroppingOverDesignerElementLefHalf) {
              cloneRow = [
                { ...newElement, type: newElement.type as ElementsType, parent: cloneCurrent.id },
                ...(cloneRow || []),
              ]
            } else if (isDroppingOverDesignerElementRightHalf) {
              cloneRow = [
                ...(cloneRow ?? []),
                { ...newElement, type: newElement.type as ElementsType, parent: cloneCurrent.id },
              ]
            }
            newElement = {
              ...cloneCurrent,
              row: cloneRow,
            }
            updateElement(overId, newElement)
            return
          }
        }
        addElement(indexForNewElement, newElement)
        return
      }
      // Third scenario
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement

      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId
        const overId = over.data?.current?.elementId

        const activeElementIndex = elements.findIndex((el) => el.id === activeId)

        const overElementIndex = elements.findIndex((el) => el.id === overId)

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found")
        }

        const activeElement = { ...elements[activeElementIndex] }
        removeElement(activeId)

        let indexForNewElement = overElementIndex // assuming it's on the top-half
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1
        }

        addElement(indexForNewElement, activeElement)
      }
    },
  })

  return (
    <div className="flex h-full w-full">
      <div
        className="w-full p-2"
        onClick={() => {
          if (selectedElement) setSelectedElement(null)
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "m-auto flex h-full w-full flex-1 flex-grow flex-col items-center justify-start overflow-y-auto rounded-xl bg-gray-400",
            droppable.isOver && "ring-4 ring-inset ring-primary",
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="flex flex-grow items-center text-3xl font-bold text-muted-foreground">Thả vào đây</p>
          )}

          {droppable.isOver && elements.length === 0 && (
            <div className="w-full p-4">
              <div className="h-fit min-h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex w-full flex-col gap-2 p-4">
              {elements.map((element) => {
                if (element.hasSameRow) {
                  return <DesignerElementRow key={element.id} element={element} />
                }
                return <DesignerElementWrapper key={element.id} element={element} isInRow={false} />
              })}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  )
}

function DesignerElementRow({ element }: { element: FormElementInstance }) {
  const topHalfRow = useDroppable({
    id: element.id + "-topRow",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  })

  const bottomHalfRow = useDroppable({
    id: element.id + "-bottomRow",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  })

  const leftHalfRow = useDroppable({
    id: element.id + "-leftRow",
    data: {
      type: element.type,
      elementId: element.id,
      isLeftHalfDesignerElement: true,
    },
  })

  const rightHalfRow = useDroppable({
    id: element.id + "-rightRow",
    data: {
      type: element.type,
      elementId: element.id,
      isRightHalfDesignerElement: true,
    },
  })

  const draggableRow = useDraggable({
    id: element.id + "-drag-handlerRow",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  })
  return (
    <div
      ref={draggableRow.setNodeRef}
      {...draggableRow.listeners}
      {...draggableRow.attributes}
      className="relative flex w-full gap-2"
    >
      <div ref={topHalfRow.setNodeRef} className="absolute h-1/2 w-full rounded-t-md" />
      <div ref={bottomHalfRow.setNodeRef} className="absolute bottom-0 h-1/2 w-full rounded-b-md" />

      <div ref={leftHalfRow.setNodeRef} className="absolute left-0 h-full w-1/12 rounded-t-md" />

      <div ref={rightHalfRow.setNodeRef} className="absolute bottom-0 right-0 h-full w-1/12 rounded-b-md" />
      {(element?.row ?? []).map((el) => (
        <DesignerElementWrapper key={el.id} element={el} isInRow={true} />
      ))}
      {topHalfRow.isOver && <div className="absolute top-0 h-[7px] w-full rounded-md rounded-b-none bg-pink-300" />}
      {leftHalfRow.isOver && <div className="absolute left-0 h-full w-2 rounded-md rounded-b-none bg-pink-300" />}
      {rightHalfRow.isOver && <div className="absolute right-0 h-full w-2 rounded-md rounded-b-none bg-pink-300" />}
      {bottomHalfRow.isOver && (
        <div className="absolute bottom-0 h-[7px] w-full rounded-md rounded-t-none bg-pink-300" />
      )}
    </div>
  )
}

function DesignerElementWrapper({ element, isInRow }: { element: FormElementInstance; isInRow: boolean }) {
  const { elements, updateElement, removeElement, selectedElement, setSelectedElement, addElement } = useDesigner()

  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  })

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  })

  const leftHalf = useDroppable({
    id: element.id + "-left",
    data: {
      type: element.type,
      elementId: element.id,
      isLeftHalfDesignerElement: true,
    },
  })

  const rightHalf = useDroppable({
    id: element.id + "-right",
    data: {
      type: element.type,
      elementId: element.id,
      isRightHalfDesignerElement: true,
    },
  })

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  })

  if (draggable.isDragging) return null // temporary remove the element from designer

  if (!element.type) {
    throw new Error("Element type is undefined")
  }
  const DesignerElement = FormElements[element.type].designerComponent
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(element)
      }}
      className={`${
        selectedElement?.id === element.id ? "border-red-400" : "border-transparent"
      } bg-fieldBg1 relative flex h-fit min-h-[120px] w-full flex-col rounded-md border-2 border-dashed border-red-500 text-foreground ring-1 ring-inset ring-accent hover:cursor-pointer`}
    >
      {!isInRow && <div ref={topHalf.setNodeRef} className="absolute h-1/2 w-full rounded-t-md" />}
      {!isInRow && <div ref={bottomHalf.setNodeRef} className="absolute bottom-0 h-1/2 w-full rounded-b-md" />}

      {!isInRow && <div ref={leftHalf.setNodeRef} className="absolute left-0 h-full w-1/12 rounded-t-md" />}

      {!isInRow && <div ref={rightHalf.setNodeRef} className="absolute bottom-0 right-0 h-full w-1/12 rounded-b-md" />}

      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex h-full justify-center rounded-md rounded-l-none border bg-blue-500 text-white hover:bg-blue-800"
              onClick={(e) => {
                e.stopPropagation() // avoid selection of element while deleting
                console.log("delte", element)
                if (isInRow) {
                  const parentId = element.parent
                  let parentElement = elements.find((el) => el.id === parentId)
                  const row = (parentElement?.row ?? []).filter((el) => el.id !== element.id)
                  console.log("deleteRow", row)
                  if (row.length > 1 && parentElement) {
                    parentElement = {
                      ...parentElement,
                      row: row.map((el) => ({ ...el, type: el.type as ElementsType })),
                    }
                    updateElement(parentId as string, parentElement)
                  } else if (row.length === 1) {
                    const parentIndex = elements.findIndex((el) => el.id === parentId)
                    removeElement(parentId as string)
                    addElement(parentIndex, row[0])
                  }
                } else {
                  removeElement(element.id)
                }
                setSelectedElement(null)
              }}
            >
              <TrashIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-sm font-semibold text-black">Nhấn vào thành phần hoặc kéo để di chuyển</p>
          </div>
        </>
      )}
      {topHalf.isOver && <div className="absolute top-0 h-[7px] w-full rounded-md rounded-b-none bg-pink-300" />}
      {leftHalf.isOver && <div className="absolute left-0 h-full w-2 rounded-md rounded-b-none bg-pink-300" />}
      {rightHalf.isOver && <div className="absolute right-0 h-full w-2 rounded-md rounded-b-none bg-pink-300" />}
      <div
        className={cn(
          "pointer-events-none flex h-fit min-h-[120px] w-full items-center rounded-md bg-accent/40 px-4 py-4 opacity-100",
          mouseIsOver && "opacity-30",
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && <div className="absolute bottom-0 h-[7px] w-full rounded-md rounded-t-none bg-pink-300" />}
    </div>
  )
}

export default Designer
