import { Form, FormItem } from "@/components/shared/Form"
import { Input } from "@/components/shared/Input"
import { Label } from "@/components/shared/Label"
import { Switch } from "@/components/shared/switch"
import { BookText } from "lucide-react"
import { useEffect, useState } from "react"

import useDesigner from "@/hooks/useDesigner"
import { cn } from "@/lib/utils"
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "@/type/designer"
import { useForm } from "react-hook-form"
const type: ElementsType = "TextField"
const extraAttributes = {
  label: "Text field",
  helperText: "Helper text",
  required: false,
  placeHolder: "Value here...",
  variant: "basic",
}

interface propertiesForm {
  label: string
  helperText: string
  required: boolean
  placeHolder: string
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
      <Input readOnly disabled placeholder={placeHolder} />
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

  const { label, required, placeHolder, helperText } = element.extraAttributes
  return (
    <div className="flex w-full flex-col gap-2 text-black">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Label className={cn(error && "border-red-500")}>{error ? "This field is required" : ""}</Label>
      <Input
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return
          const valid = TextFieldFormElement.validate(element, e.target.value)
          setError(!valid)
          if (!valid) return
          submitValue(element.id, e.target.value)
        }}
        value={value}
      />
      {helperText && <p className={cn("text-[0.8rem] text-muted-foreground", error && "text-red-500")}>{helperText}</p>}
    </div>
  )
}

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => {
    return {
      id,
      type,
      extraAttributes: {
        label: "Text Field",
        helperText: "Enter your text here",
        required: false,
        placeholder: "Value here...",
        variant: "basic",
      },
    }
  },

  designerButtonElement: {
    icon: <BookText />,
    label: "Text Field",
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
  console.log("TextField", element)
  const { elements, updateElement } = useDesigner()
  const [label, setLabel] = useState<string>(element.extraAttributes.label)
  const [required, setRequired] = useState<boolean>(element.extraAttributes.required)
  const [placeHolder, setPlaceHolder] = useState<string>(element.extraAttributes.placeHolder)
  const [helperText, setHelperText] = useState<string>(element.extraAttributes.helperText)

  useEffect(() => {
    setLabel(element.extraAttributes.label)
    setRequired(element.extraAttributes.required)
    setPlaceHolder(element.extraAttributes.placeHolder)
    setHelperText(element.extraAttributes.helperText)
  }, [])

  const applyChanges = (values: propertiesForm) => {
    const { label, required, placeHolder, helperText } = values
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
      },
    })
  }

  const form = useForm()

  const onSubmit = () => {
    applyChanges({ label, placeHolder, helperText, required })
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
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Placeholder</Label>
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
        <button
          className="group/btn relative h-fit w-full rounded-lg bg-gradient-to-br from-black to-neutral-600 text-md font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Submit &rarr;
          <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
          </>
        </button>
      </form>
    </Form>
  )
}
