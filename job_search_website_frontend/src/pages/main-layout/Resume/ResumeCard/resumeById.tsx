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

  const getResume = useQuery({
    queryKey: ["getResumeId", resumeId],
    queryFn: () => resumeApi.getResumeById(resumeId as string),
    enabled: isLoggedIn,
    refetchOnMount: true,
  })

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
      <div className="col-span-4 flex w-full flex-col gap-6">
        <div className="relative mt-5 max-h-[500px] w-full rounded-xl">
          <img
            src={CompanyDefault}
            className="absolute top-1/2 z-20 ml-[60px] h-[138px] w-[138px] -translate-y-1/4 rounded-full bg-white"
          />
          <img src={CompanyBgDefault} className="w-full rounded-tl-xl rounded-tr-xl" />
          <div className="flex justify-center rounded-bl-xl rounded-br-xl bg-companyCover py-[30px]">
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
        {!getResume.isLoading && <EduResume resumeData={resumeData} setResumeData={setResumeData} />}
        {!getResume.isLoading && <ExpResume resumeData={resumeData} setResumeData={setResumeData} />}
      </div>
    </div>
  )
}
