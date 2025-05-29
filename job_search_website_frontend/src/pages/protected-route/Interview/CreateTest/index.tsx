import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/shared/dialog"
import { useEffect, useState } from "react"

// import PreviewDialogButton from '@/components/buttons/PreviewDialogButton'
import Designer from "@/components/FormBuilder/Designer"
import DragOverlayWrapper from "@/components/FormBuilder/DragOverlayWrapper"
import useDesigner from "@/hooks/useDesigner"
import { FormElementInstance } from "@/type/designer"
import { Button } from "@/components/shared/Button"

const CreateTest = ({
  id,
  openCreateTest,
  setOpenCreateTest,
  setContent,
}: {
  id: number
  openCreateTest: boolean
  setOpenCreateTest: React.Dispatch<React.SetStateAction<boolean>>
  setContent: (elements: FormElementInstance[]) => void
}) => {
  const { elements, setElements, setSelectedElement } = useDesigner()
  const [isReady, setIsReady] = useState<boolean>(false)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px tolerance to define a drag (less than 10 is a click),
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300, // 250ms hold to define a drag
      tolerance: 5, // 10px tolerance to define a drag (less than 10 is a click)
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    if (isReady) return
    setSelectedElement(null)
    const readyTimeout = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(readyTimeout)
  }, [setElements])

  return (
    <Dialog key={id} open={openCreateTest} onOpenChange={setOpenCreateTest}>
      <DialogContent className="!h-fit !max-h-[600px] !w-[1200px] overflow-y-auto px-8">
        <DialogHeader className="flex flex-row items-center justify-center">
          <DialogTitle className="text-2xl text-navTitle">Tạo bài test</DialogTitle>
        </DialogHeader>
        <DndContext id="builder-dnd" sensors={sensors}>
          <main className="flex w-full flex-col">
            <header className="flex items-center justify-between gap-3 border-b-2 p-2">
              <h2 className="truncate font-medium">
                <span className="mr-2 text-black text-muted-foreground">Form:</span>
              </h2>
              {/* <div className='flex items-center gap-2'>
              <PreviewDialogButton />
              {!form.published && (
                <>
                  <SaveFormButton id={form.id} />
                  <PublishFormButton id={form.id} />
                </>
              )}
            </div> */}
            </header>
            <div className="relative flex h-[400px] w-full flex-grow items-center justify-center overflow-y-auto bg-background">
              <Designer />
            </div>
          </main>
          <DragOverlayWrapper />
          {/* <DragOverlayWrapper />
        <CodePortal selector='codePortal' show={showPortal}>
          <CodePreviewer
            dynamicCode={dynamicCode}
            dynamicImports={dynamicImports}
            setDynamicCode={setDynamicCode}
            formattedCode={formattedCode}
            handleModal={handleModal}
            showPortal={showPortal}
            copyImports={copyImports}
            copyCode={copyCode}
          />
        </CodePortal> */}
        </DndContext>
        <DialogFooter className="mt-4 flex w-full gap-3 bg-white">
          <Button
            onClick={() => setOpenCreateTest(false)}
            className="w-full rounded-md bg-red-600 py-2 text-center font-semibold text-white transition-all hover:bg-red-700"
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              setContent(elements)
              setOpenCreateTest(false)
            }}
            className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700"
          >
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTest
