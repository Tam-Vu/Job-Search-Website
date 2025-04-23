import { CheckSquare2Icon } from "lucide-react"
import { Checkbox } from "@radix-ui/react-checkbox"
import { Form, FormItem } from "@/components/shared/Form"
import { Input } from "@/components/shared/Input"
import { Switch } from "@radix-ui/react-switch"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import useDesigner from "@/hooks/useDesigner"
import { cn } from "@/lib/utils"
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "@/type/designer"
import { Label } from "@/components/shared/Label"

interface PropertiesForm {
  label: string
  helperText: string
  required: boolean
}

const type: ElementsType = "CheckBoxField"
const extraAttributes = {
  label: "CheckBox Field",
  helperText: "Helper text",
  required: false,
  variant: "basic",
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

const DesignerComponent = ({ elementInstance }: { elementInstance: FormElementInstance }) => {
  const element = elementInstance as CustomInstance
  const { label, required, helperText } = element.extraAttributes
  const id = `checkbox-${element.id}`
  return (
    <div className="items-top flex h-fit w-full gap-2 space-x-2 rounded-lg bg-white p-2 text-red-500">
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none">
        <Label>
          {label}
          {required && "*"}
        </Label>
        {helperText && <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>}
      </div>
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
  const [value, setValue] = useState<boolean>(defaultValue === "true" ? true : false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  const { label, required, helperText } = element.extraAttributes
  const id = `checkbox-${element.id}`
  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        id={id}
        checked={value}
        className={cn(error && "border-red-500")}
        onCheckedChange={(checked) => {
          console.log("checked", checked)
          setValue(!value)
          if (!submitValue) return
          const stringValue = value ? "true" : "false"
          const valid = CheckBoxFieldFormElement.validate(element, stringValue)
          setError(!valid)
          submitValue(element.id, stringValue)
        }}
      />
      <div className="grid gap-1.5 leading-none text-black">
        <Label className={cn(error && "text-red-500")}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p className={cn("text-[0.8rem] text-muted-foreground", error && "text-red-500")}>{helperText}</p>
        )}
      </div>
    </div>
  )
}

export const CheckBoxFieldFormElement: FormElement = {
  type,
  construct: (id: string) => {
    return {
      id,
      type,
      extraAttributes: {
        label: "CheckBox Field",
        helperText: "Enter your text here",
        required: false,
        variant: "basic",
      },
    }
  },

  designerButtonElement: {
    icon: <CheckSquare2Icon />,
    label: "CheckBox Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance
    if (element.extraAttributes.required) {
      return currentValue === "true"
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
  useEffect(() => {
    setLabel(element.extraAttributes.label)
    setRequired(element.extraAttributes.required)
    setHelperText(element.extraAttributes.helperText)
  }, [])

  const applyChanges = (values: PropertiesForm) => {
    const { label, required, helperText } = values
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
        helperText,
      },
    })
  }
  const form = useForm()

  const onSubmit = () => {
    applyChanges({ label, required, helperText })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormItem>
          <div>
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Label</Label>
            <Input
              className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur()
                }
              }}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
        </FormItem>

        <FormItem>
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Label</Label>
          <Input
            className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => setHelperText(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Required</Label>
          <Switch checked={required} onCheckedChange={() => setRequired(!required)} />
        </FormItem>
        <button
          className="group/btn relative block h-full w-full rounded-md bg-gradient-to-br from-black to-neutral-600 text-xl font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
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
