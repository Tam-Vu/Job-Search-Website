/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Button, notification } from 'antd'
import { Button } from "../shared/Button"
import { Loader, MousePointerClick } from "lucide-react"
import { useCallback, useRef, useState, useTransition } from "react"

import { FormElementInstance, FormElements } from "@/type/designer"
import { toast } from "react-toastify"

const FormSubmitComponent = ({ formUrl, content }: { formUrl?: string; content: FormElementInstance[] }) => {
  const formValues = useRef<Record<string, string>>({})
  const formErrors = useRef<Record<string, boolean>>({})
  const [renderKey, setRenderKey] = useState(new Date().getTime())
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  const validateForm: () => boolean = useCallback(() => {
    content.forEach((element) => {
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
  }, [content])
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
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="flex w-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <h1 className="text-2xl font-bold">Form Submitted</h1>
          <p className="text-muted-foreground">Thank you for submitting the form. You can close this page now.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-2">
      <div
        key={renderKey}
        className="flex w-full flex-grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-400"
      >
        {content.map((element) => {
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
        <Button
          //   onClick={() => startTransition(submitForm)}
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
      </div>
    </div>
  )
}

export default FormSubmitComponent
