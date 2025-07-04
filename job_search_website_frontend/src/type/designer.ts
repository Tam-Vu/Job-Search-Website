/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactElement } from "react"

import { CheckBoxFieldFormElement } from "@/components/FormBuilder/fields/CheckBoxField"
import { DateFieldFormElement } from "@/components/FormBuilder/fields/DateField"
import { SelectFieldFormElement } from "@/components/FormBuilder/fields/SelectField"
import { TextFieldFormElement } from "@/components/FormBuilder/fields/TextField"
import { TitleFieldFormElement } from "@/components/FormBuilder/fields/TitleField"
import { RadioGroupFieldFormElement } from "@/components/FormBuilder/fields/RadioGroupField"

export type ElementsType =
  | "TextField"
  | "TitleField"
  | "DateField"
  | "SelectField"
  | "CheckBoxField"
  | "RadioGroupField"
// | "RadioField"
// | "SwitchField"
// | "StepperField"

export type SubmitFunction = (key: string, value: string) => void
export interface FormElement {
  type: ElementsType

  construct: (id: string) => FormElementInstance

  designerButtonElement: {
    icon: ReactElement | SetConstructor
    label: string
    extraAttributes?: Record<string, any>
  }
  designerComponent: FC<{ elementInstance: FormElementInstance }>
  formComponent: FC<{
    elementInstance: FormElementInstance
    submitValue?: SubmitFunction
    isInvalid?: boolean
    defaultValue?: string
  }>
  propertiesComponent: FC<{ elementInstance: FormElementInstance }>

  validate: (formElement: FormElementInstance, currentValue: string) => boolean
}

type FormElementsType = Record<ElementsType, FormElement>

export interface FormElementInstance {
  id: string
  type?: ElementsType
  extraAttributes?: Record<string, any>
  hasSameRow?: boolean
  parent?: string
  row?: FormElementInstance[]
}

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckBoxField: CheckBoxFieldFormElement,
  RadioGroupField: RadioGroupFieldFormElement,
}
