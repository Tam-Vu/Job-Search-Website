import { resumeApi } from "@/apis"
import CompanyBgDefault from "@/assets/CompanyBgDefault.jpg"
import { useAuth } from "@/hooks/useAuth"
import { Resume } from "@/type/resume"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Layout/Components/Select"
import { FaStar, FaRegStar, FaFilter } from "react-icons/fa"
import { formatDate } from "@/config"
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
  const role = localStorage.getItem("role")

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

  const [rating, setRating] = useState(0)
  const getResumeRatings = useQuery({
    queryKey: ["resumeRating", resumeId],
    queryFn: () => resumeApi.getRatingResume(resumeId as string),
    enabled: isLoggedIn,
    refetchOnMount: true,
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [filterRating, setFilterRating] = useState("all")

  const filteredComments = useMemo(() => {
    let actualRatingComments = getResumeRatings.data?.DT ?? []
    if (role === "employer") {
      const employerId = localStorage.getItem("employerId")
      actualRatingComments = actualRatingComments.filter((c) => c.employerId === parseInt(employerId as string))
    }
    if (filterRating === "all") return actualRatingComments
    return actualRatingComments.filter((c) => c.star === parseInt(filterRating))
  }, [getResumeRatings.data?.DT, role, filterRating])

  const averageRating = useMemo(() => {
    console.log("getResumeRatings", getResumeRatings.data)
    if ((getResumeRatings.data?.DT ?? []).length === 0) return 0
    const sum = (getResumeRatings.data?.DT ?? []).reduce((acc, c) => acc + c.star, 0)
    return (sum / (getResumeRatings.data?.DT ?? []).length).toFixed(1)
  }, [getResumeRatings])

  // Function to render star rating
  const renderStars = (count: number, interactable = false) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (interactable) {
        stars.push(
          <span
            key={i}
            className="cursor-pointer"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
          >
            {i <= (hoverRating || rating) ? (
              <FaStar className="text-yellow-400" size={24} />
            ) : (
              <FaRegStar className="text-gray-400" size={24} />
            )}
          </span>,
        )
      } else {
        stars.push(
          <span key={i}>
            {i <= count ? (
              <FaStar className="text-yellow-400" size={16} />
            ) : (
              <FaRegStar className="text-gray-400" size={16} />
            )}
          </span>,
        )
      }
    }
    return stars
  }

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
      {role !== "employer" ? (
        <Button
          className="fixed right-4 top-1/2 z-50 rounded-lg bg-blue-500 px-2 py-1 text-xs font-semibold text-white"
          onClick={handleUpdate}
        >
          Save Changes
        </Button>
      ) : null}
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
              {role !== "employer" ? (
                <DialogTrigger className="border-none bg-transparent p-0">
                  <div className="cursor-pointer rounded-full bg-transparent p-2 transition-all hover:bg-secondaryColor">
                    <Edit className="text-black" size={20} />
                  </div>
                </DialogTrigger>
              ) : null}
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
      <div className="col-span-2 mt-5 flex h-fit w-full flex-col gap-6 rounded-xl bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold text-black">Đánh giá CV</span>
            <span className="flex items-center gap-1">
              {renderStars(Math.round(Number(averageRating)))}
              <span className="ml-1 text-sm font-medium text-black">
                ({averageRating})({(getResumeRatings.data?.DT ?? []).length} lượt đánh giá)
              </span>
            </span>
          </div>
        </div>

        {/* Comments filter */}
        <div className="mt-4 flex items-center gap-2">
          <FaFilter size={16} className="text-navTitle" />
          <span className="text-sm font-medium text-black">Lọc theo:</span>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="h-8 w-32 border-slate-300 bg-white text-black">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent className="text-black">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="5">5 sao</SelectItem>
              <SelectItem value="4">4 sao</SelectItem>
              <SelectItem value="3">3 sao</SelectItem>
              <SelectItem value="2">2 sao</SelectItem>
              <SelectItem value="1">1 sao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Comments list */}
        <div className="mt-4 flex max-h-[400px] flex-col gap-4 overflow-y-auto">
          {filteredComments.map((c) => (
            <div key={c.id} className="border-b border-slate-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-black">{c.employer.companyName}</span>
                <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
              </div>
              <div className="my-1 flex">{renderStars(c.star)}</div>
              <p className="text-sm text-black">{c.content}</p>
            </div>
          ))}

          {filteredComments.length === 0 && (
            <div className="py-4 text-center text-gray-500">Không có đánh giá nào với bộ lọc hiện tại</div>
          )}
        </div>
      </div>
    </div>
  )
}
