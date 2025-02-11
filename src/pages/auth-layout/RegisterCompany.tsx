import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import authApi from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { BackgroundBeams } from "@/components/shared/ui/BackgroundBeam"
import { useNavigate } from "react-router"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { Input } from "@/components/shared/ui/AnimatedHoverInput"
import { MultiSelect } from "react-multi-select-component"
import { jobFields } from "@/features/filter/data"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import _ from "lodash"
import generateFroalaConfig from "@/config/froala.config"
import FroalaEditorComponent from "@/components/shared/froalaEditorComponent"
import { Filter } from "@/type"

const formSchema = z.object({
  confirmPassword: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  email: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  password: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  companyName: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  companyDescription: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  location: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  website: z.string().optional(),
})

type CreateCompanyDTO = z.infer<typeof formSchema>

export const RegisterCompanyForm = () => {
  const navigate = useNavigate()
  const [selecField, setSelectField] = useState<Filter[]>([])
  const [companyDescription, setCompanyDescription] = useState<string>("")
  const froalaConfig = useMemo(() => generateFroalaConfig(), [])
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCompanyDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      companyName: "",
      companyDescription: "",
      location: "",
    },
  })

  useEffect(() => {
    if (companyDescription) {
      setValue("companyDescription", companyDescription)
    }
  }, [companyDescription, setValue])

  const RegisterCompany = useMutation({
    mutationFn: authApi.RegisterCompany,
    onSuccess: (Res) => {
      if (Res?.EC === 0) {
        toast.success("Dang ki thành công!")
        navigate("/login")
      } else {
        toast.error("Error")
      }
    },
    onError: () => {
      toast.error("Error")
    },
  })

  function onSubmit(values: CreateCompanyDTO) {
    console.log("onSubmit", values)
    const fieldArr = _.join(
      selecField.map((field) => field.value),
      "-",
    )
    console.log("fieldArr", fieldArr, selecField)
    const data = {
      confirmPassword: values.confirmPassword,
      email: values.email,
      password: values.password,
      companyName: values.companyName,
      companyDescription: values.companyDescription,
      location: values.location,
      website: values.website,
      field: fieldArr,
    }
    RegisterCompany.mutate(data)
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="z-30 mx-auto my-auto h-max w-full max-w-2xl rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to Job Search Website</h2>
        <p className="mt-2 max-w-lg text-xl text-neutral-600 dark:text-neutral-300">--Register as a Recruiter--</p>
        <form className="mb-8 mt-2 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex flex-col space-y-2 md:space-x-2">
            <span className="mb-4 w-fit border-b-4 border-navTitle pb-2 text-xl font-bold text-black">Tai khoan</span>
            <LabelInputContainer>
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} id="email" placeholder="jsw@gnail.com" type="text" />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" {...register("password")} placeholder="******" type="password" />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input id="confirmPassword" {...register("confirmPassword")} placeholder="******" type="password" />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </LabelInputContainer>
            <span className="mb-4 w-fit border-b-4 border-navTitle pb-2 text-xl font-bold text-black">
              Thong tin cong ty
            </span>
            <LabelInputContainer>
              <Label htmlFor="companyName">Ten cong ty</Label>
              <Input id="companyName" {...register("companyName")} type="text" />
              {errors.companyName && <p className="text-red-500">{errors.companyName.message}</p>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="location">Dia chi</Label>
              <Input {...register("location")} id="location" type="text" />
              {errors.location && <p className="text-red-500">{errors.location.message}</p>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="website">Website cong ty ( neu co )</Label>
              <Input {...register("website")} id="website" type="text" />
              {errors.website && <p className="text-red-500">{errors.website.message}</p>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="field">Linh vuc của công ty</Label>
              <MultiSelect
                options={jobFields}
                value={selecField}
                onChange={setSelectField}
                labelledBy="Chọn lĩnh vực"
                className="z-50 w-full text-base text-black"
              />
            </LabelInputContainer>
            <div className="h-auto">
              <Label>Mo ta cong ty</Label>
              <FroalaEditorComponent
                tag="textarea"
                config={froalaConfig}
                model={companyDescription}
                onModelChange={(e: string) => setCompanyDescription(e)}
              />
            </div>
          </div>

          <button
            className="group/btn relative block h-full w-full rounded-md bg-gradient-to-br from-black to-neutral-600 text-xl font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>
          <button
            className="group/btn relative my-4 block h-full w-full rounded-md bg-gradient-to-br from-black to-neutral-600 text-xl font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            onClick={() => navigate("/login")}
          >
            Already have an account? &rarr;
            <BottomGradient />
          </button>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

export const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}
