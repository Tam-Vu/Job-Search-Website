import { jobApi } from "@/apis"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import { FaMapMarkerAlt } from "react-icons/fa"
import { CgSandClock } from "react-icons/cg"
import { TbClockFilled } from "react-icons/tb"
import { GrDocument, GrMoney } from "react-icons/gr"
import { experience, salary } from "@/features/filter/data"
import { formatDate } from "@/config"
import FroalaViewComponent from "@/components/shared/froalaEditorViewComponent"
import { Timer, View } from "lucide-react"
import { RecruitmentTable } from "./Resume"

export const RecruitById = () => {
  const { recruitId } = useParams()
  const { data: jobData } = useQuery({
    queryKey: ["Jobs", recruitId],
    queryFn: () => jobApi.getJobById(Number(recruitId)),
    refetchInterval: (query) => {
      const currentStatus = query.state?.data
      if (currentStatus) {
        return false
      }
      return 300000 // 5 minutes
    },
  })
  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="mt-5 grid h-full grid-cols-6 gap-6 bg-background">
        <div className="col-span-4 flex w-full flex-col gap-6">
          <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
            <span className="text-wrap text-xl font-bold text-black">{jobData?.DT.title}</span>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                  <GrMoney className="text-white" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-sm text-black">Mức lương</span>
                  <span className="text-sm font-semibold text-black">
                    {salary.filter((val) => val.key === jobData?.DT.salaryRange).map((val) => val.name)}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                  <FaMapMarkerAlt className="text-white" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-sm text-black">Địa điểm</span>
                  <span className="text-sm font-semibold text-black">{jobData?.DT.location}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                  <CgSandClock className="text-white" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-sm text-black">Kinh nghiệm</span>
                  <span className="text-sm font-semibold text-black">
                    {experience.filter((val) => val.key === jobData?.DT.experience).map((val) => val.name)}
                  </span>
                </div>
              </div>
            </div>
            <span className="mt-4 flex w-fit items-center rounded-md bg-background px-2 py-1 text-sm text-black">
              <TbClockFilled size={20} className="mr-2 text-companyJobCard" />
              Hạn nộp hồ sơ: {formatDate(jobData?.DT.closedDate || "")}
            </span>
            <div className="flex w-full flex-col rounded-md bg-white px-6 py-5 text-black">
              <span className="border-l-4 border-navTitle pl-[10px] text-xl font-bold text-black">
                Chi tiết tin tuyển dụng
              </span>
              <span className="mb-2 mt-6 text-[16px] font-semibold text-black">Mô tả công việc</span>
              <FroalaViewComponent model={jobData?.DT.description} />
              <span className="mb-2 mt-6 text-[16px] font-semibold text-black">Yêu cầu công việc</span>
              <FroalaViewComponent model={jobData?.DT.requirements} />
            </div>
          </div>
        </div>
        <div className="col-span-2 flex w-full flex-col gap-6">
          <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
            <span className="font-bold text-black">Thống kê</span>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                <GrDocument className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-sm text-black">Số lượng CV</span>
                <span className="text-sm font-semibold text-black">5</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                <View className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-sm text-black">Số lượng đã xem</span>
                <span className="text-sm font-semibold text-black">10</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
                <Timer className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-sm text-black">Tổng thời gian</span>
                <span className="text-sm font-semibold text-black">355h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RecruitmentTable />
    </div>
  )
}
