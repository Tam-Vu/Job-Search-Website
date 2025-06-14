import { Form, FormItem } from "@/components/shared/Form"
import { Input } from "@/components/shared/Input"
import { Label } from "@/components/shared/Label"
import { Switch } from "@/components/shared/switch"
import { PlusCircle, Radio, X } from "lucide-react"
import { useEffect, useState } from "react"

import useDesigner from "@/hooks/useDesigner"
import { cn } from "@/lib/utils"
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "@/type/designer"
import { timestampID } from "@/config"
import { Button } from "@/components/shared/Button"
import { useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/shared/RadioGroup"

const type: ElementsType = "RadioGroupField"
const extraAttributes = {
  label: "Câu hỏi trắc nghiệm",
  helperText: "Chọn một đáp án",
  required: false,
  options: [] as Array<{ id: string; text: string; isCorrect: boolean; value: number }>,
  variant: "basic",
}

interface propertiesForm {
  label: string
  helperText: string
  required: boolean
  options: { id: string; text: string; isCorrect: boolean }[]
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

const DesignerComponent = ({ elementInstance }: { elementInstance: FormElementInstance }) => {
  const element = elementInstance as CustomInstance
  const { label, required, helperText, options } = element.extraAttributes
  console.log("options", options)

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-white p-2 text-black">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <div className="flex flex-col gap-2 text-black">
        {options.length > 0 ? (
          <RadioGroup disabled>
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <RadioGroupItem id={option.id} value={option.text} disabled />
                <Label className="!text-black" htmlFor={option.id}>
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có đáp án nào</p>
        )}
      </div>
      {helperText && <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>}
    </div>
  )
}

const FormComponent = ({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance
  submitValue?: SubmitFunction
  isInvalid?: boolean
  defaultValue?: string
}) => {
  const element = elementInstance as CustomInstance
  const [value, setValue] = useState(defaultValue || "")
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  const { label, required, helperText, options } = element.extraAttributes
  console.log("options", options)

  return (
    <div className="flex w-full flex-col gap-2 text-black">
      <Label>
        {label}
        {required && "*"}
      </Label>
      {error && <Label className="text-red-500">Trường này không được để trống</Label>}

      <RadioGroup
        defaultValue={value}
        onValueChange={(value) => {
          setValue(value)
          if (!submitValue) return
          const valid = RadioGroupFieldFormElement.validate(element, value)
          setError(!valid)
          submitValue(element.id, value)
        }}
      >
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <RadioGroupItem id={option.id} value={option.value.toString()} />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>

      {helperText && <p className={cn("text-[0.8rem] text-muted-foreground", error && "text-red-500")}>{helperText}</p>}
    </div>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { elements, updateElement } = useDesigner()
  const [label, setLabel] = useState<string>(element.extraAttributes.label)
  const [required, setRequired] = useState<boolean>(element.extraAttributes.required)
  const [helperText, setHelperText] = useState<string>(element.extraAttributes.helperText)
  const [options, setOptions] = useState<{ id: string; text: string; isCorrect: boolean }[]>(
    element.extraAttributes.options,
  )

  useEffect(() => {
    setLabel(element.extraAttributes.label)
    setRequired(element.extraAttributes.required)
    setHelperText(element.extraAttributes.helperText)
    setOptions(element.extraAttributes.options)
  }, [element.extraAttributes])

  const applyChanges = (values: propertiesForm) => {
    const { label, required, helperText, options } = values
    if (element?.parent) {
      let parentElement = elements.find((el) => el.id === element.parent)
      let parentRow = parentElement?.row

      if (parentRow && parentRow.length > 0) {
        const currentElement = parentRow.find((el) => el.id === element.id)
        if (!currentElement) {
          throw new Error("Element not found")
        }
        parentRow = parentRow.map((el) => {
          if (el.id === element.id) {
            return {
              ...el,
              extraAttributes: {
                label,
                required,
                helperText,
                options,
                variant: element.extraAttributes.variant,
              },
            }
          }
          return el
        })
        parentElement = {
          ...parentElement,
          id: parentElement?.id || "",
          row: parentRow,
        }

        updateElement(parentElement.id, parentElement)
        return
      }
      return
    }

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        required,
        helperText,
        options,
        variant: element.extraAttributes.variant,
      },
    })
  }

  const form = useForm()

  const onSubmit = () => {
    applyChanges({ label, required, helperText, options })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormItem>
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Tiêu đề câu hỏi</Label>
          <Input
            className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
            value={label}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => setLabel(e.target.value)}
          />
        </FormItem>

        <FormItem>
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Chú thích</Label>
          <Input
            className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
            value={helperText}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => setHelperText(e.target.value)}
          />
        </FormItem>

        <FormItem className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Không được bỏ trống</Label>
          <Switch checked={required} onCheckedChange={() => setRequired(!required)} />
        </FormItem>

        <br />

        <FormItem>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Câu trả lời</Label>
            <div className="flex items-center justify-between">
              <Button
                className="text-md gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  // Khi thêm một option mới, nếu chưa có option nào, đặt option đầu tiên là đúng
                  const isFirstOption = options.length === 0
                  setOptions([...options, { id: `${timestampID()}`, text: "", isCorrect: isFirstOption }])
                }}
              >
                <PlusCircle className="" />
                Thêm câu trả lời
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Input
                  placeholder=""
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = options.map((opt) =>
                      opt.id === option.id ? { ...opt, text: e.target.value } : opt,
                    )
                    setOptions(newOptions)
                  }}
                  className="flex-1 bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
                />
                {/* Radio button để chọn option chính xác */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`correct-${option.id}`}
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={() => {
                      // Đặt option này là đúng và tất cả các option khác là sai
                      const newOptions = options.map((opt) => ({
                        ...opt,
                        isCorrect: opt.id === option.id,
                      }))
                      setOptions(newOptions)
                    }}
                    className="h-4 w-4 cursor-pointer text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor={`correct-${option.id}`} className="ml-1 text-xs text-gray-500">
                    Đáp án đúng
                  </label>
                </div>
                <Button
                  className="!h-8 !w-10 flex-shrink-0 rounded-full p-0"
                  onClick={(e) => {
                    e.preventDefault()
                    const newOptions = options.filter((opt) => opt.id !== option.id)
                    // Nếu xóa option đang được đánh dấu là đúng, đánh dấu option đầu tiên là đúng (nếu có)
                    if (option.isCorrect && newOptions.length > 0) {
                      newOptions[0].isCorrect = true
                    }
                    setOptions(newOptions)
                  }}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
        </FormItem>

        <br />
        <Button className="w-full" type="submit">
          Lưu thay đổi
        </Button>
      </form>
    </Form>
  )
}

export const RadioGroupFieldFormElement: FormElement = {
  type,
  construct: (id: string) => {
    return {
      id,
      type,
      extraAttributes: {
        label: "Câu hỏi trắc nghiệm",
        helperText: "Chọn một đáp án",
        required: false,
        options: [],
        variant: "basic",
      },
    }
  },

  designerButtonElement: {
    icon: <Radio />,
    label: "Câu hỏi trắc nghiệm",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance
    if (element.extraAttributes.required && !currentValue) {
      return false
    }
    return true
  },
}
