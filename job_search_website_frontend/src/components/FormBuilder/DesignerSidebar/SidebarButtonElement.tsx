import { useDraggable } from "@dnd-kit/core"
import { Button } from "@/components/shared/Button"

import { cn } from "@/lib/utils"
import { FormElement } from "@/type/designer"

const SidebarButtonElement = ({ formElement }: { formElement: FormElement }) => {
  const { label } = formElement.designerButtonElement as unknown as {
    label: string
    // icon: React.ElementType
  }
  const draggable = useDraggable({
    id: `designer-button-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
      isDraggableButtonElement: true,
    },
  })

  return (
    <div className="relative h-[120px] w-[120px]">
      <Button
        className={cn(
          "bg-primary-foreground group relative flex h-full w-full cursor-grab flex-col gap-2 border border-primary bg-white text-primary shadow-sm transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          draggable.isDragging && "ring-2 ring-primary",
        )}
        ref={draggable.setNodeRef}
        {...draggable.attributes}
        {...draggable.listeners}
      >
        {/* <Icon className='h-8 w-8 text-primary cursor-grab group-hover:text-primary' /> */}
        <p className="text-xs">{label}</p>
      </Button>
    </div>
  )
}

export const SidebarButtonDragOverlay = ({ formElement }: { formElement: FormElement }) => {
  const { label } = formElement.designerButtonElement as unknown as {
    label: string
    // icon: React.ElementType
    extraAttributes?: Record<string, unknown>
  }
  return (
    <Button className="group flex h-[120px] w-[120px] -translate-x-[200%] -translate-y-1/2 cursor-grab flex-col gap-2 text-white">
      {/* <Icon className='h-8 w-8 text-primary cursor-grab group-hover:text-primary' /> */}
      <p className="text-xs group-hover:text-white">{label}</p>
    </Button>
  )
}

export default SidebarButtonElement
