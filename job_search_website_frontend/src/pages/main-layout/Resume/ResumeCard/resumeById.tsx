import { resumeApi } from "@/apis"
import CompanyBgDefault from "@/assets/CompanyBgDefault.jpg"
import { useAuth } from "@/hooks/useAuth"
import { Resume } from "@/type/resume"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { EduResume } from "./resumeEdu"
import { ExpResume } from "./resumeExp"
import { toast } from "react-toastify"
import _ from "lodash"
import { UpdateData } from "@/apis/resume"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/shared/dialog"
import { LabelInputContainer } from "@/pages/auth-layout/RegisterCompany"
import { Edit, User2 } from "lucide-react"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { Textarea } from "@/components/shared/TextArea"
import { Button } from "@/components/shared/Button"
import { SkillResume } from "./ResumeSKill"
import defaultAvatar from "@/assets/DefaultUser.png"
import { MdOutlineMarkEmailRead } from "react-icons/md"
const defaultData = {
  id: "",
  name: "",
  skill: "",
  experience: "",
  description: "",
  field: "",
  employeeId: "",
  employee: {
    id: 0,
    fullName: "",
    userId: "",
    user: {
      email: "",
      image: null,
    },
  },
  resumeSkills: [],
  experienceDetails: [],
  educations: [],
  updatedAt: "",
}

export const ResumeById = () => {
  const { resumeId } = useParams()
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)
  const [des, setDes] = useState<string>("")
  const getResume = useQuery({
    queryKey: ["getResumeId", resumeId],
    queryFn: () => resumeApi.getResumeById(resumeId as string),
    enabled: isLoggedIn,
    refetchOnMount: true,
  })

  useEffect(() => {
    if (getResume.data) {
      setDes(getResume.data.DT.description)
    }
  }, [getResume.data])

  const [resumeData, setResumeData] = useState<Resume>(defaultData)

  useEffect(() => {
    if (getResume.data) {
      setResumeData(getResume.data.DT)
    }
  }, [getResume.data])

  const updateResume = useMutation({
    mutationFn: (data: UpdateData) => resumeApi.updateResume(data, resumeId as string),
    onSuccess: (Res) => {
      if (Res?.EC === 0) {
        toast.success("Dang ki thành công!")
        queryClient.invalidateQueries({ queryKey: ["getMyResume"] })
        queryClient.invalidateQueries({ queryKey: ["getResumeId", resumeId] })
      } else {
        toast.error("Error")
      }
    },
    onError: () => {
      toast.error("Error")
    },
  })

  const handleUpdate = () => {
    const dataOmit = _.omit(resumeData, ["id", "employee", "updatedAt", "employeeId", "skill", "experience", "field"])
    console.log("experienceDetails", dataOmit.experienceDetails)
    const experienceDetails = dataOmit.experienceDetails
      .filter((detail) => detail !== undefined)
      .map((detail) => {
        const removeId = _.omit(detail, ["id"])
        return removeId
      })
    const educations = dataOmit.educations
      .filter((detail) => detail !== undefined)
      .map((detail) => {
        const removeId = _.omit(detail, ["id"])
        return removeId
      })
    const updateData = {
      name: dataOmit.name,
      description: dataOmit.description,
      skills: dataOmit.resumeSkills,
      experienceDetails: experienceDetails,
      educations: educations,
    }
    updateResume.mutate(updateData)
  }

  console.log("getResume", getResume.data)
  console.log("resumeData", resumeData)
  return (
    <div className="mt-5 grid h-full w-screen grid-cols-6 gap-6 overflow-x-hidden bg-background px-[106px] pb-10">
      <Button
        className="fixed right-4 top-1/2 z-50 rounded-lg bg-blue-500 px-2 py-1 text-xs font-semibold text-white"
        onClick={handleUpdate}
      >
        Save Changes
      </Button>
      <div className="col-span-4 flex w-full flex-col gap-6">
        <div className="relative mt-5 max-h-[500px] w-full rounded-xl">
          <img
            src={resumeData.employee.user.image ?? defaultAvatar}
            className="absolute top-1/2 z-20 ml-[60px] h-[138px] w-[138px] -translate-y-1/4 rounded-full bg-white"
          />
          <img src={CompanyBgDefault} className="w-full rounded-tl-xl rounded-tr-xl" />
          <div className="flex justify-center rounded-bl-xl rounded-br-xl bg-white py-[30px]">
            <div className="flex max-w-[622px] flex-col">
              <div className="flex items-center">
                <User2 size={20} className="mr-4 text-sm text-black" />
                <span className="text-wrap text-xl font-semibold text-black">{resumeData.employee.fullName}</span>
              </div>
              <div className="flex items-center text-black">
                <MdOutlineMarkEmailRead size={18} className="mr-5 text-sm text-black" />
                <span className="text-wrap text-sm font-light text-black">{resumeData.employee.user.email}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col rounded-md bg-white px-6 py-5">
          <div className="flex w-full items-center justify-between">
            <span className="text-base font-semibold text-black">Giới thiệu</span>
            <Dialog
              open={openDialog}
              onOpenChange={() => {
                setOpenDialog(!openDialog)
              }}
            >
              <DialogTrigger className="border-none bg-transparent p-0">
                <div className="cursor-pointer rounded-full bg-transparent p-2 transition-all hover:bg-secondaryColor">
                  <Edit className="text-black" size={20} />
                </div>
              </DialogTrigger>
              <DialogContent className="flex w-80 flex-col justify-center px-8">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle className="text-2xl text-navTitle">Giới thiệu bản thân</DialogTitle>
                </DialogHeader>
                <LabelInputContainer>
                  <Label htmlFor="university">Giới thiệu</Label>
                  <Textarea
                    className="text-black"
                    value={des}
                    onChange={(e) => setDes(e.target.value)}
                    placeholder="Nhập giới thiệu"
                  />
                </LabelInputContainer>
                <DialogFooter className="flex w-full gap-3 bg-white">
                  <Button
                    onClick={() => {
                      setOpenDialog(false)
                    }}
                    className="w-full rounded-md bg-red-600 py-2 text-center font-semibold text-white transition-all hover:bg-red-700"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={() => {
                      setResumeData({ ...resumeData, description: des })
                      setDes("")
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
            <span className="text-black">{resumeData.description}</span>
          </div>
        </div>
        {!getResume.isLoading && <EduResume resumeData={resumeData} setResumeData={setResumeData} />}
        {!getResume.isLoading && <ExpResume resumeData={resumeData} setResumeData={setResumeData} />}
        {!getResume.isLoading && <SkillResume resumeData={resumeData} setResumeData={setResumeData} />}
      </div>
    </div>
  )
}
