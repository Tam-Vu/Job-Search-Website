import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/shared/Form"
import FormGroup from "@/components/shared/form-group"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { BackgroundBeams } from "@/components/shared/ui/BackgroundBeam"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router"

const formSchema = z.object({
  email: z.string().min(1, "Vui lòng điền vào chỗ trống"),
  password: z.string().min(1, "Vui lòng điền vào chỗ trống"),
})

export const LoginForm = () => {
  const { logIn } = useAuth()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const Login = useMutation({
    mutationFn: logIn,
    onSuccess: (EC) => {
      if (EC === 0) {
        toast.success("Dang nhap thành công!")
        form.reset()
        const role = localStorage.getItem("role")
        if (role === "employer") navigate("/recruite-manage")
        else {
          navigate("/")
        }
      } else {
        toast.error("Error")
      }
    },
    onError: () => {
      toast.error("Error")
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      email: values.email,
      password: values.password,
    }
    Login.mutate(data)
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="z-30 mx-auto my-auto w-full max-w-2xl rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to Job Search Website</h2>
        <p className="mt-2 max-w-lg text-xl text-neutral-600 dark:text-neutral-300">
          Login to aceternity if you can because we don&apos;t have a login flow yet
        </p>
        <Form {...form}>
          <form className="mb-8 mt-2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-col space-y-2 md:space-x-2 md:space-y-0">
              <FormGroup
                control={form.control}
                label="Email"
                name="email"
                type="email"
                placeholder="jsw@gmail.com"
                inputClassName="text-base p-6"
              />
              <FormGroup
                control={form.control}
                label="Nhap mat khau"
                name="password"
                type="password"
                placeholder="••••••••"
                inputClassName="text-base p-6"
              />
            </div>
            <button
              className="group/btn relative block h-full w-full rounded-md bg-gradient-to-br from-black to-neutral-600 text-xl font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Log in &rarr;
              <BottomGradient />
            </button>
            <button
              className="group/btn relative mt-4 block h-full w-full rounded-md bg-gradient-to-br from-black to-neutral-600 text-xl font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              onClick={() => navigate("/register-user")}
            >
              Don't have an account? &rarr;
              <BottomGradient />
            </button>
          </form>
        </Form>
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

// const LabelInputContainer = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div className={cn("flex flex-col space-y-2 w-full", className)}>
//       {children}
//     </div>
//   );
// };
