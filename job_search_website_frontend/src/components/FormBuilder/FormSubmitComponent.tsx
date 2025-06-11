/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "../shared/Button"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/shared/dialog"
import { Loader, MousePointerClick } from "lucide-react"
import { useCallback, useRef, useState, useTransition } from "react"

import { FormElementInstance, FormElements } from "@/type/designer"
import { toast } from "react-toastify"
import { useQuery } from "@tanstack/react-query"
import createTestApi from "@/apis/createTest"

const FormSubmitComponent = ({
  content,
  id,
  setFormContent,
  onclose,
  viewOnly = true,
}: {
  content?: FormElementInstance[]
  id: number
  setFormContent: React.Dispatch<React.SetStateAction<FormElementInstance[]>>
  viewOnly?: boolean
  onclose?: () => void
}) => {
  const formValues = useRef<Record<string, string>>({})
  const formErrors = useRef<Record<string, boolean>>({})
  const [renderKey, setRenderKey] = useState(new Date().getTime())
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  const questions = useQuery({
    queryKey: ["formContent", id],
    queryFn: () => createTestApi.getTestDetail(id.toString()),
  })
  console.log("questions", questions, id)

  const testQuestions =
    questions.data?.DT?.questions.map((question) => {
      const data = {
        id: question.id.toString(),
        type: question.questionType,
        extraAttributes: {
          label: question.questionText,
          placeholder: question.placeholder,
          required: question.isRequired,
          helperText: question.helperText,
          options: question.choices,
        },
      }
      return data as FormElementInstance
    }) || []

  const formData = content ?? testQuestions
  console.log("formData", formData, content, testQuestions)

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
      const jsonContent = JSON.stringify(formValues.current)
      console.log("jsonContent", jsonContent)
      toast.success("Form submitted successfully")
      //   await SubmitForm(formUrl, jsonContent)
      setSubmitted(true)
    } catch (error) {
      console.log("Error", error)
      toast.error("Something went wrong.")
    }
    // console.log(formValues.current)
  }

  if (submitted) {
    return (
      <Dialog
        key={id}
        open={submitted}
        onOpenChange={() => {
          setFormContent([])
          setSubmitted(false)
        }}
      >
        <DialogContent className="!h-fit !w-fit overflow-y-auto">
          <div className="flex h-full w-full items-center justify-center p-8 text-black">
            <div className="flex w-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
              <h1 className="text-2xl font-bold">Form Submitted</h1>
              <p className="text-muted-foreground">Thank you for submitting the form. You can close this page now.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog key={id} open onOpenChange={onclose}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="h-fit !max-h-[600px] w-[1200px] overflow-y-auto px-8"
      >
        <DialogHeader className="flex flex-row items-center justify-center">
          <DialogTitle className="text-2xl text-navTitle">Giao diện bài test</DialogTitle>
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
            {!viewOnly ? (
              <Button
                onClick={() =>
                  startTransition(() => {
                    void submitForm()
                  })
                }
                disabled={pending}
                className="mt-8"
              >
                {!pending && (
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="mr-2" />
                    Submit
                  </div>
                )}
                {pending && <Loader className="animate-spin" />}
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FormSubmitComponent
