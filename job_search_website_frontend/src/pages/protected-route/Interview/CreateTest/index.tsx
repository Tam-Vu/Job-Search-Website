import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/shared/dialog"
import { useEffect, useState } from "react"

// import PreviewDialogButton from '@/components/buttons/PreviewDialogButton'
import Designer from "@/components/FormBuilder/Designer"
import DragOverlayWrapper from "@/components/FormBuilder/DragOverlayWrapper"
import useDesigner from "@/hooks/useDesigner"
import { FormElementInstance } from "@/type/designer"
import { Button } from "@/components/shared/Button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import createTestApi, { AddQuestionDTO } from "@/apis/createTest"
import { toast } from "react-toastify"
import { Input } from "@/components/shared/ui/AnimatedHoverInput"
import { Textarea } from "@/components/shared/TextArea"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"

const CreateTest = ({
  id: initTestId,
  openCreateTest,
  setOpenCreateTest,
  setContent,
  skipStep = false,
}: {
  id?: number
  openCreateTest: boolean
  setOpenCreateTest: React.Dispatch<React.SetStateAction<boolean>>
  setContent: (elements: FormElementInstance[]) => void
  skipStep?: boolean
}) => {
  const queryClient = useQueryClient()
  const { elements, setElements, setSelectedElement } = useDesigner()
  const [isReady, setIsReady] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [testId, setTestId] = useState<number | undefined>(initTestId)

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

  const testDetail = useQuery({
    queryKey: ["testDetail", testId],
    queryFn: () => createTestApi.getTestDetail(testId!.toString()),
    enabled: !!testId,
  })

  console.log("testDetail", testDetail.data)

  const CreateTest = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const res = await createTestApi.createTest(data)
      setTestId(res?.DT.id)
    },
    onSuccess: () => {
      toast.success("Test created successfully!!!")
      queryClient.invalidateQueries({ queryKey: ["createdTest"] })
      setStep(2)
    },
    onError: (error) => {
      console.error("Error creating test:", error)
    },
  })

  const AddQuestionToTest = useMutation({
    mutationFn: (data: AddQuestionDTO) => createTestApi.addQuestionInTest(data, testId!),
    onSuccess: () => {
      toast.success("Question added successfully!!!")
      queryClient.invalidateQueries({ queryKey: ["createdTest"] })
    },
    onError: (error) => {
      console.error("Error adding question:", error)
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    if (skipStep) {
      setStep(2)
    }
  }, [skipStep])

  useEffect(() => {
    if (isReady) return
    setSelectedElement(null)
    const readyTimeout = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(readyTimeout)
  }, [setElements])

  return (
    <Dialog open={openCreateTest} onOpenChange={setOpenCreateTest}>
      {step === 1 && (
        <DialogContent className="!h-fit !max-h-[600px] !w-[750px] overflow-y-auto px-8">
          <DialogHeader className="flex flex-row items-center justify-center">
            <DialogTitle className="text-2xl text-navTitle">Tạo bài kiểm tra</DialogTitle>
          </DialogHeader>
          <div className="flex w-full flex-col justify-center gap-1">
            <Label className="text-lg font-semibold text-navTitle">Tiêu đề</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề bài kiểm tra"
              className="!mb-2"
            />
            <Label className="text-lg font-semibold text-navTitle">Mô tả</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả bài kiểm tra"
              className="text-gray-400"
            />
          </div>
          <DialogFooter className="mt-4 flex w-full gap-3 bg-white">
            <Button
              onClick={() => {
                const data = {
                  title,
                  description,
                }
                CreateTest.mutate(data)
              }}
              className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700"
            >
              Tạo bài kiểm tra
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      {step === 2 && testId && (
        <DialogContent className="!h-fit !max-h-[600px] !w-[1200px] overflow-y-auto px-8">
          <DialogHeader className="flex flex-row items-center justify-center">
            <DialogTitle className="text-2xl text-navTitle">
              Thêm câu hỏi vào bài kiểm tra: {testDetail.data?.DT.title}
            </DialogTitle>
          </DialogHeader>
          <span className="text-base text-black">{testDetail.data?.DT.description}</span>
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
                console.log("elements", elements)
                AddQuestionToTest.mutate({
                  questions: elements.map((element) => ({
                    questionText: element.extraAttributes?.label,
                    questionType: element.type ?? "text", // Default to "text" if type is not defined
                    helperText: element.extraAttributes?.helperText,
                    placeholder: element.extraAttributes?.placeholder,
                    isRequired: element.extraAttributes?.isRequired,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    choices: element.extraAttributes?.options?.map((choice: any) => ({
                      idFront: choice.id,
                      text: choice.text,
                      isCorrect: choice.isCorrect,
                    })),
                  })),
                })
                setOpenCreateTest(false)
              }}
              className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700"
            >
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default CreateTest
