import { HTMLInputTypeAttribute } from "react"
import { Control } from "react-hook-form"
import { cn } from "@/lib/utils"
import { FormControl, FormField, FormItem, FormMessage } from "./Form"
import { Input as AnimationInput } from "./ui/AnimatedHoverInput"
import React from "react"
import { Label } from "./ui/AnimatedHoverLabel"

interface FormGroupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  label: string
  name: string
  placeholder?: string
  type?: HTMLInputTypeAttribute
  autoFocus?: boolean
  inputClassName?: string
  disabled?: boolean
}

export default function FormGroup({
  control,
  label,
  name,
  placeholder,
  type,
  autoFocus,
  inputClassName,
  disabled,
}: FormGroupProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <LabelInputContainer>
            <Label className="text-sm font-medium text-black">{label}</Label>
            <FormControl>
              <AnimationInput
                className={cn(inputClassName)}
                placeholder={placeholder}
                type={type}
                autoFocus={autoFocus}
                disabled={disabled}
                {...field}
              />
            </FormControl>
          </LabelInputContainer>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}
