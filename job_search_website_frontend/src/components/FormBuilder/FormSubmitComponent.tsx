/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "../shared/Button"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/shared/dialog"
import { Loader, MousePointerClick } from "lucide-react"
import { useCallback, useRef, useState, useTransition } from "react"

import { ElementsType, FormElementInstance, FormElements } from "@/type/designer"
import { toast } from "react-toastify"
import { useMutation, useQuery } from "@tanstack/react-query"
import createTestApi, { QuizResult } from "@/apis/createTest"

type Answer = {
  questionId: number
  choiceId?: number
  essayAnswer?: string
}

const FormSubmitComponent = ({
  content,
  id,
  setFormContent,
  onclose,
  viewOnly = true,
}: {
  content?: FormElementInstance[]
  id: number
  setFormContent?: React.Dispatch<React.SetStateAction<FormElementInstance[]>>
  viewOnly?: boolean
  onclose?: () => void
}) => {
  const formValues = useRef<Record<string, string>>({})
  const formErrors = useRef<Record<string, boolean>>({})
  const [renderKey, setRenderKey] = useState(new Date().getTime())
  const [pending, startTransition] = useTransition()
  const [submitAns, setSubmitAns] = useState<QuizResult>()

  const questions = useQuery({
    queryKey: ["formContent", id],
    queryFn: () => createTestApi.getTestDetail(id.toString()),
  })
  console.log("questions", questions.data?.DT, id)

  const allResults = useQuery({
    queryKey: ["QuizResult", id],
    queryFn: () => createTestApi.getAllEmployeeResultByQuizId(id.toString()),
    enabled: !!id && viewOnly,
  })
  console.log("allResults", allResults.data?.DT, id)

  const {
    mutate: submitAnswer,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (data: Answer[]) => createTestApi.submitAnswer(id.toString(), data),
    onSuccess: (data) => {
      if (data) {
        setSubmitAns(data.DT)
      }
      toast.success("Answer submitted successfully")
    },
    onError: (error) => {
      console.error("Error submitting answer:", error)
      toast.error("Failed to submit answer")
    },
  })

  const testQuestions =
    questions.data?.DT?.questions.map((question) => {
      let data: FormElementInstance = {
        id: question.id.toString(),
        type: question.questionType as ElementsType,
        extraAttributes: {
          label: question.questionText,
          placeholder: question.placeholder,
          required: question.isRequired,
          helperText: question.helperText,
          options: question.choices?.map((choice) => ({
            id: choice.idFront,
            value: choice.id,
            text: choice.choiceText,
            isCorrect: choice.isCorrect,
          })),
        },
      }
      if (submitAns) {
        const answer = submitAns.detailedResults.find((ans) => ans.id === question.id)
        if (answer) {
          data = {
            ...data,
            extraAttributes: {
              ...data.extraAttributes,
              isCorrect: answer.isCorrect,
              score: answer.score,
              feedback: answer.feedback,
              Answer: {
                ...answer.Answer,
              },
            },
          }
        }
      }
      return data as FormElementInstance
    }) || []

  const formData = (content ?? []).length && content ? content : testQuestions
  console.log("formData", formData, content, testQuestions)

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value
  }, [])
  const submitForm = async () => {
    formErrors.current = {}
    const validForm = validateForm()

    if (!validForm) {
      setRenderKey(new Date().getTime())
      toast.error("Please check the form for errors")
      return
    }

    try {
      const answers: Answer[] = []
      Object.entries(formValues.current).forEach(([key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let formatData: any = {
          questionId: parseInt(key),
        }
        const question = questions.data?.DT?.questions.find((q) => q.id.toString() === key)
        if (question?.questionType === "SelectField" || question?.questionType === "RadioGroupField") {
          formatData = {
            ...formatData,
            choiceId: parseInt(value),
          }
        } else if (question?.questionType === "TextField") {
          formatData = {
            ...formatData,
            essayAnswer: value,
          }
        }
        answers.push(formatData)
        console.log("answers", answers)
        const jsonContent = JSON.stringify(formValues.current)
        console.log("jsonContent", jsonContent, formValues.current)

        submitAnswer(answers)
      })
    } catch (error) {
      console.log("Error", error)
      toast.error("Something went wrong.")
    }
    // console.log(formValues.current)
  }

  const validateForm: () => boolean = useCallback(() => {
    formData.forEach((element) => {
      const actualValue = formValues.current[element.id] || ""
      const formElement = element.type ? FormElements[element.type] : undefined
      let isValid = true
      if (formElement) {
        isValid = formElement.validate(element, actualValue)
        if (!isValid) {
          formErrors.current[element.id] = true
        }
      }
      if (!isValid) {
        formErrors.current[element.id] = true
      }
    })

    if (Object.keys(formErrors.current).length > 0) {
      return false
    }

    return true
  }, [formData])

  return (
    <Dialog key={id} open onOpenChange={onclose}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="h-fit !max-h-[600px] w-[1200px] overflow-y-auto px-8"
      >
        <DialogHeader className="flex flex-row items-center justify-center">
          <DialogTitle className="text-2xl text-navTitle">Bài kiểm tra {questions.data?.DT.title}</DialogTitle>
        </DialogHeader>
        <div className="h-full w-full p-2">
          <div
            key={renderKey}
            className="flex w-full flex-grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-400"
          >
            {formData.map((element) => {
              if (element.hasSameRow) {
                return (
                  <div key={element.id} className="flex flex-row gap-4">
                    {element.row?.map((rowElement: FormElementInstance) => {
                      const FormElement = rowElement.type ? FormElements[rowElement.type].formComponent : null
                      return FormElement ? (
                        <FormElement
                          key={rowElement.id}
                          elementInstance={rowElement}
                          submitValue={submitValue}
                          defaultValue={formValues.current[rowElement.id]}
                        />
                      ) : null
                    })}
                  </div>
                )
              }
              if (!element.type) return null
              const FormElement = FormElements[element.type].formComponent
              return (
                <FormElement
                  key={element.id}
                  isInvalid={formErrors.current[element.id]}
                  elementInstance={element}
                  submitValue={submitValue}
                  defaultValue={formValues.current[element.id]}
                />
              )
            })}
            {!viewOnly && !submitAns ? (
              <Button
                onClick={() =>
                  startTransition(() => {
                    void submitForm()
                  })
                }
                disabled={pending}
                className="mt-8"
              >
                {!pending && !isPending && (
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="mr-2" />
                    Submit
                  </div>
                )}
                {(pending || isPending) && <Loader className="animate-spin" />}
              </Button>
            ) : (
              <div className="flex flex-col justify-between">
                <div className="mt-4 flex items-start justify-between gap-2 border-t-[1px] border-dashed border-gray-400 pt-5 align-top text-black">
                  <span>Kết quả bài kiểm tra</span>
                  <div className="flex flex-col gap-1">
                    <span>Điểm trung bình: {submitAns?.percentageScore || 0}%</span>
                    <span>Tổng số câu đúng: {submitAns?.correctAnswers}</span>
                    <span>Điểm hiển thị: {submitAns?.scoreDisplay}</span>
                  </div>
                </div>
                <div className="mt-10 flex w-full justify-center text-black">
                  Nhà tuyển dụng sẽ gửi email đến cho bạn trong vài giờ tới
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex h-full w-full flex-grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-400">
          {viewOnly && (allResults.data?.DT ?? []).length > 0 && (
            <div className="mt-4 flex w-full flex-col gap-4 text-black">
              <h2 className="text-xl font-semibold">Danh sách kết quả</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="w-full border border-gray-300 px-4 py-2">Tên ứng viên</th>
                      <th className="max-w-fit text-nowrap border border-gray-300 px-4 py-2">Số câu đúng</th>
                      <th className="max-w-fit text-nowrap border border-gray-300 px-4 py-2">Điểm trung bình</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(allResults.data?.DT ?? []).map((result) => (
                      <tr key={result.id}>
                        <td className="border border-gray-300 px-4 py-2">{result.employee.fullName}</td>
                        <td className="max-w-fit border border-gray-300 px-4 py-2 text-center">
                          {result.correctAnswers}
                        </td>
                        <td className="max-w-fit border border-gray-300 px-4 py-2 text-center">
                          {result.percentageScore}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FormSubmitComponent
