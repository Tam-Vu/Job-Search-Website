import { resumeApi } from "@/apis"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Layout/Components/Select"
import { Button } from "@/components/shared/Button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/shared/dialog"
import { Input } from "@/components/shared/ui/AnimatedHoverInput"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { jobFields } from "@/features/filter/data"
import { LabelInputContainer } from "@/pages/auth-layout/RegisterCompany"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import ResumeCard from "./ResumeCard"
import { useAuth } from "@/hooks/useAuth"

export const ManageResume = () => {
  const queryClient = useQueryClient()
  useAuth()
  const { isLoggedIn } = useAuth()
  const [openDialog, setOpenDialog] = useState(false)
  const [name, setName] = useState<string>("")
  const [jobField, setJobField] = useState<string>("")

  const getMyResume = useQuery({
    queryKey: ["getMyResume"],
    queryFn: resumeApi.getResumeByEmployee,
    enabled: isLoggedIn,
    refetchOnMount: true,
  })
  console.log("getMyResume", getMyResume.data)
  const createResume = useMutation({
    mutationFn: resumeApi.createResume,
    onSuccess: (res) => {
      if (res?.EC === 0) {
        toast.success("Tạo CV thành công")
        queryClient.invalidateQueries({ queryKey: ["getMyResume"] })
      }
    },
    onError: () => {
      toast.error("Tạo CV thất bại")
    },
  })

  const handleSubmit = () => {
    createResume.mutate({ name, field: jobField })
  }

  return (
    <div className="mt-5 grid h-full w-screen grid-cols-6 gap-6 overflow-x-hidden bg-background px-[106px]">
      <div className="col-span-4 flex w-full flex-col gap-6">
        <div className="flex min-h-screen w-full flex-col rounded-md bg-white px-6 py-5">
          <div className="flex w-full items-center justify-between">
            <span className="font-base font-semibold text-black">Danh sách CV đã tạo</span>
            <Dialog
              open={openDialog}
              onOpenChange={() => {
                setOpenDialog(!openDialog)
              }}
            >
              <DialogTrigger className="group/modal-btn mt-4 flex w-fit items-center justify-center rounded-md bg-navTitle py-2 font-semibold text-white">
                <div className="absolute z-20 flex h-fit -translate-x-[200px] items-center justify-center text-white transition duration-500 group-hover/modal-btn:translate-x-0">
                  <Plus className="text-white" size={20} />
                </div>
                <span className="text-center transition duration-500 group-hover/modal-btn:translate-x-[1000px]">
                  Tạo mới
                </span>
              </DialogTrigger>
              <DialogContent className="w-80 justify-center px-8">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle className="text-2xl text-navTitle">Nhập tên CV</DialogTitle>
                </DialogHeader>
                <LabelInputContainer>
                  <Label htmlFor="name">Tên CV</Label>
                  <Input id="name" placeholder="Tên CV" type="text" onChange={(e) => setName(e.target.value)} />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="jobField">Lĩnh vực</Label>
                  <Select key={jobField} value={jobField} onValueChange={(value) => setJobField(value)}>
                    <div className="flex w-full space-x-3">
                      <SelectTrigger className="h-10 !w-full !cursor-pointer rounded-md border-[1.5px] border-slate-300 bg-white text-base !font-normal text-placeHolder">
                        <SelectValue placeholder="Chọn danh mục">
                          <span className="text-black">
                            {jobFields.filter((field) => field.key === jobField).map((field) => field.label)}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                    </div>

                    <SelectContent position="item-aligned" className="bg-white">
                      {jobFields.map((i) => (
                        <SelectItem
                          className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                          key={i.key}
                          value={i.key}
                        >
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </LabelInputContainer>
                <DialogFooter className="flex w-full gap-3 bg-white">
                  <Button
                    onClick={() => setOpenDialog(false)}
                    className="w-full rounded-md bg-red-600 py-2 text-center font-semibold text-white transition-all hover:bg-red-700"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={() => {
                      handleSubmit()
                      setOpenDialog(false)
                    }}
                    className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700"
                  >
                    Lưu
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-between mt-5 flex w-full flex-wrap gap-6">
            {(getMyResume.data?.DT ?? []).map((resume) => (
              <ResumeCard
                key={resume.id}
                title={resume.name}
                category={resume.field}
                updateDate={resume.updatedAt}
                image="https://images.unsplash.com/photo-1698047681432-006d2449c631?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                type="content"
                link={`/manage-resume/${resume.id}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-2 flex w-full flex-col gap-6"></div>
    </div>
  )
}
