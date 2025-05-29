import { Form, FormItem } from "@/components/shared/Form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Layout/Components/Select"
import { Input } from "@/components/shared/Input"
import { Label } from "@/components/shared/Label"
import { Switch } from "@/components/shared/switch"
import { PlusCircle, SquareMousePointer, X } from "lucide-react"
import { useEffect, useState } from "react"

import useDesigner from "@/hooks/useDesigner"
import { cn } from "@/lib/utils"
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "@/type/designer"
import { timestampID } from "@/config"
import { Button } from "@/components/shared/Button"
import { useForm } from "react-hook-form"

const type: ElementsType = "SelectField"
const extraAttributes = {
  label: "Select Field",
  helperText: "Helper text",
  required: false,
  placeHolder: "Value here...",
  options: [] as Array<{ id: string; value: string }>,
  variant: "basic",
}

interface propertiesForm {
  label: string
  helperText: string
  required: boolean
  placeHolder: string
  options: { id: string; value: string }[]
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

const DesignerComponent = ({ elementInstance }: { elementInstance: FormElementInstance }) => {
  const element = elementInstance as CustomInstance
  const { label, required, placeHolder, helperText } = element.extraAttributes
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-white p-2 text-red-500">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Select>
        <SelectValue placeholder={placeHolder} />
      </Select>
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

  const { label, required, placeHolder, helperText, options } = element.extraAttributes
  return (
    <div className="flex w-full flex-col gap-2 text-black">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Label className={cn(error && "border-red-500")}>{error ? "This field is required" : ""}</Label>
      <Select
        defaultValue={value}
        onValueChange={(value) => {
          setValue(value)
          if (!submitValue) return
          const valid = SelectFieldFormElement.validate(element, value)
          setError(!valid)
          submitValue(element.id, value)
        }}
      >
        <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
          <SelectValue placeholder={placeHolder}></SelectValue>
          <SelectContent>
            {options.map((i) => (
              <SelectItem
                className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                key={i.id}
                value={i.value}
              >
                {i.value}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectTrigger>
      </Select>
      {helperText && <p className={cn("text-[0.8rem] text-muted-foreground", error && "text-red-500")}>{helperText}</p>}
    </div>
  )
}

export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id: string) => {
    return {
      id,
      type,
      extraAttributes: {
        label: "Select Field",
        helperText: "Enter your text here",
        required: false,
        placeholder: "Value here...",
        variant: "basic",
        options: [],
      },
    }
  },

  designerButtonElement: {
    icon: <SquareMousePointer />,
    label: "Select Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance
    if (element.extraAttributes.required && !currentValue) {
      return currentValue.length > 0
    }
    return true
  },
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { elements, updateElement } = useDesigner()
  const [label, setLabel] = useState<string>(element.extraAttributes.label)
  const [required, setRequired] = useState<boolean>(element.extraAttributes.required)
  const [helperText, setHelperText] = useState<string>(element.extraAttributes.helperText)
  const [placeHolder, setPlaceHolder] = useState<string>(element.extraAttributes.placeHolder)
  const [options, setOptions] = useState<{ id: string; value: string }[]>(element.extraAttributes.options)
  useEffect(() => {
    setLabel(element.extraAttributes.label)
    setRequired(element.extraAttributes.required)
    setHelperText(element.extraAttributes.helperText)
    setPlaceHolder(element.extraAttributes.placeHolder)
    setOptions(element.extraAttributes.options)
  }, [])

  const applyChanges = (values: propertiesForm) => {
    const { label, required, placeHolder, helperText, options } = values
    if (element?.parent) {
      let parentElement = elements.find((el) => el.id === element.parent)
      let parentRow = parentElement?.row
      console.log("VaoParent", parentElement, elements, element)
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
                placeHolder,
                helperText,
                options,
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
        console.log("parentElement", parentElement)
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
        placeHolder,
        helperText,
        options,
      },
    })
  }

  const form = useForm()

  const onSubmit = () => {
    applyChanges({ label, required, placeHolder, helperText, options })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormItem>
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Label</Label>
          <Input
            className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => setLabel(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">PlaceHolder</Label>
          <Input
            className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => setPlaceHolder(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Helper Text</Label>
          <Input
            className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => setHelperText(e.target.value)}
          />
        </FormItem>
        <FormItem className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Required</Label>
          <Switch checked={required} onCheckedChange={() => setRequired(!required)} />
        </FormItem>
        <br />
        <FormItem>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Options</Label>
            <div className="flex items-center justify-between">
              <Button
                className="text-md gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  setOptions([...options, { id: `${timestampID()}`, value: "" }])
                }}
              >
                <PlusCircle className="" />
                Add
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center justify-between gap-1">
                <Input
                  placeholder=""
                  value={option.value}
                  onChange={(e) => {
                    const newOptions = options.map((opt) =>
                      opt.id === option.id ? { ...opt, value: e.target.value } : opt,
                    )
                    setOptions(newOptions)
                  }}
                  className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
                />
                <Button
                  className="!h-8 !w-10 rounded-full p-0"
                  onClick={(e) => {
                    e.preventDefault()
                    const newOptions = options.filter((opt) => opt.id !== option.id)
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
          Save Changes
        </Button>
      </form>
    </Form>
  )
}
