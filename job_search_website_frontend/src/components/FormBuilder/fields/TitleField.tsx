import { Form, FormItem } from "@/components/shared/Form"
import { Input } from "@/components/shared/Input"
import { Label } from "@/components/shared/Label"
import { Heading1 } from "lucide-react"
import { useEffect, useState } from "react"

import useDesigner from "@/hooks/useDesigner"
import { ElementsType, FormElement, FormElementInstance } from "@/type/designer"
import { useForm } from "react-hook-form"

const type: ElementsType = "TitleField"
const extraAttributes = {
  title: "",
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

interface propertiesForm {
  title: string
}

const DesignerComponent = ({ elementInstance }: { elementInstance: FormElementInstance }) => {
  const element = elementInstance as CustomInstance
  const { title } = element.extraAttributes
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-white p-2 text-red-500">
      <Label className="text-muted-foreground">Tiêu đề</Label>
      <p className="text-xl">{title === "" ? "No Title Value" : title}</p>
    </div>
  )
}

const FormComponent = ({ elementInstance }: { elementInstance: FormElementInstance }) => {
  const element = elementInstance as CustomInstance

  const { title } = element.extraAttributes
  return <p className="text-xl text-black">{title === "" ? "No Title Value" : title}</p>
}

export const TitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => {
    return {
      id,
      type,
      extraAttributes: {
        title: "",
        variant: "basic",
      },
    }
  },

  designerButtonElement: {
    icon: <Heading1 />,
    label: "Tiêu đề",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true, // No validation needed
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { elements, updateElement } = useDesigner()
  const [title, setTitle] = useState(element.extraAttributes.title)

  useEffect(() => {
    setTitle(element.extraAttributes.title)
  }, [])

  const applyChanges = (values: propertiesForm) => {
    const { title } = values
    console.log("ApplyChanges", title)
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
                title,
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
        title,
      },
    })
  }

  const form = useForm()

  const onSubmit = () => {
    applyChanges({ title })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormItem>
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-300">Title</Label>
          <Input
            className="bg-white text-black focus-visible:ring-sky-500 dark:bg-black/80"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormItem>
        <button
          className="group/btn text-md relative h-fit w-full rounded-lg bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
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
