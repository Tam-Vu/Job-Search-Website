import { resumeApi } from "@/apis"
import CompanyBgDefault from "@/assets/CompanyBgDefault.jpg"
import CompanyDefault from "@/assets/CompanyDefault.png"
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
import { Edit } from "lucide-react"
import { Label } from "@/components/shared/ui/AnimatedHoverLabel"
import { Textarea } from "@/components/shared/TextArea"
import { Button } from "@/components/shared/Button"

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
    const experienceDetails = _.omit(dataOmit.experienceDetails, ["id"]).filter((detail) => detail !== undefined)
    const educations = _.omit(dataOmit.educations, ["id"]).filter((detail) => detail !== undefined)
    const updateData = {
      ...dataOmit,
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
            src={CompanyDefault}
            className="absolute top-1/2 z-20 ml-[60px] h-[138px] w-[138px] -translate-y-1/4 rounded-full bg-white"
          />
          <img src={CompanyBgDefault} className="w-full rounded-tl-xl rounded-tr-xl" />
          <div className="flex justify-center rounded-bl-xl rounded-br-xl bg-white py-[30px]">
            {/* <div className="flex max-w-[622px] flex-col items-center">
              <span className="text-wrap text-xl font-semibold text-white">{companyData?.DT.companyName}</span>
              <div className="mt-4 flex flex-wrap gap-5">
                <div className="flex items-center">
                  <CiGlobe size={18} className="mr-4 text-sm text-white" />
                  https://www.facebook.com/CRCVietnamCareer
                </div>
                <div className="flex items-center">
                  <BiBuildings size={18} className="mr-4 text-sm text-white" />
                  500-1000 nhân viên
                </div>
                <div className="flex items-center">
                  <FaUsers size={18} className="mr-4 text-sm text-white" />
                  122 người theo dõi
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="flex h-full w-full flex-col rounded-md bg-white px-6 py-5">
          <div className="flex w-full items-center justify-between">
            <span className="font-base font-semibold text-black">Giới thiệu</span>
            <div className="space-between mt-5 flex w-full flex-wrap gap-6">
              <span className="text-black">{resumeData.description}</span>
            </div>
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
              <DialogContent className="w-80 justify-start px-8">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle className="text-2xl text-navTitle">Giới thiệu bản thân</DialogTitle>
                </DialogHeader>
                <LabelInputContainer>
                  <Label htmlFor="university">Giới thiệu</Label>
                  <Textarea value={des} onChange={(e) => setDes(e.target.value)} placeholder="Nhập giới thiệu" />
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
        </div>
        {!getResume.isLoading && <EduResume resumeData={resumeData} setResumeData={setResumeData} />}
        {!getResume.isLoading && <ExpResume resumeData={resumeData} setResumeData={setResumeData} />}
      </div>
    </div>
  )
}
