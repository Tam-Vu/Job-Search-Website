import { Pencil } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import DefaultUser from "@/assets/DefaultUser.png"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/apis"
import { useAuth } from "@/hooks/useAuth"
import { User } from "@/type/auth"
import { LabelInputContainer } from "@/pages/auth-layout/RegisterCompany"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { Input } from "@/components/shared/ui/AnimatedHoverInput"
import { toast } from "react-toastify"
import { Button } from "@/components/shared/Button"

export const AccountProfile = () => {
  const queryClient = useQueryClient()
  const { isLoggedIn } = useAuth()
  const getMe = useQuery({
    queryKey: ["getMe"],
    queryFn: () => authApi.currentUser(),
    enabled: isLoggedIn,
  })
  const [accountData, setAccountData] = useState<User>({
    id: 1,
    email: "",
    image: null,
    role: "",
    employee: {
      id: 1,
      fullName: "",
      userId: 1,
    },
    employer: {
      id: 1,
      companyName: "",
      companyDescription: "",
      location: "",
      website: "",
      status: "",
      field: "",
      userId: 1,
    },
  })
  console.log("accountData", accountData.image)
  const [imageFile, setImageFile] = useState<File | null>(null)
  // const [email, setEmail] = useState<string>("")
  // const [fullName, setFullName] = useState<string>("")
  const inputRef = useRef<HTMLInputElement | null>(null)
  const handleUploadFile = () => {
    inputRef.current?.click()
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  useEffect(() => {
    if (getMe.data) {
      setAccountData(getMe.data.DT)
    }
  }, [getMe.data])

  useEffect(() => {
    if (imageFile != null) {
      setAccountData((prevData) => {
        return {
          ...prevData,
          image: URL.createObjectURL(imageFile),
        }
      })
    }

    return () => {
      if (accountData.image) {
        URL.revokeObjectURL(accountData.image)
      }
    }
  }, [accountData.image, imageFile])

  const updateUser = useMutation({
    mutationFn: authApi.updateUser,
    onSuccess: (Res) => {
      if (Res?.EC === 0) {
        toast.success("Cập nhật thành công!")
        queryClient.invalidateQueries({ queryKey: ["getMe"] })
      } else {
        toast.error("Error")
      }
    },
    onError: () => {
      toast.error("Error")
    },
  })

  const handleSubmit = () => {
    const updateData = {
      email: accountData.email,
      fullName: accountData.employee.fullName,
      image: accountData.image,
      file: imageFile,
    }
    console.log("updateData", updateData)
    updateUser.mutate(updateData)
  }

  return (
    <main className="flex w-screen flex-1 flex-col items-center gap-6 py-6 pl-6">
      <h1 className="text-lg font-semibold text-black">Thông Tin Tài Khoản</h1>
      <div className="flex w-full items-center justify-center">
        <form onSubmit={handleSubmit}>
          <div className="relative ml-auto flex w-full items-center justify-center">
            <img className="h-28 w-28 rounded-full border-4 border-[#C2E1FF]" src={accountData.image || DefaultUser} />
            <div
              className="absolute bottom-[10px] left-[62%] flex h-4 w-4 items-center justify-center rounded-full bg-[#64646D] hover:cursor-pointer"
              onClick={handleUploadFile}
            >
              <Pencil className="absolute h-3 w-3 text-white" />
            </div>
          </div>
          <input type="file" accept="image/*" ref={inputRef} onChange={handleFileChange} style={{ display: "none" }} />
          <div className="flex flex-col gap-2">
            <LabelInputContainer>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={accountData.email}
                type="text"
                onChange={(e) =>
                  setAccountData((prev) => {
                    return {
                      ...prev,
                      email: e.target.value,
                    }
                  })
                }
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={accountData.employee.fullName}
                type="text"
                onChange={(e) =>
                  setAccountData((prev) => {
                    return {
                      ...prev,
                      employee: {
                        ...prev.employee,
                        fullName: e.target.value,
                      },
                    }
                  })
                }
              />
            </LabelInputContainer>
          </div>
          <Button type="submit" className="mt-2 flex w-full items-center justify-center">
            Cập nhật
          </Button>
        </form>
      </div>
    </main>
  )
}
