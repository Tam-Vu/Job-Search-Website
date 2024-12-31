import { GrMoney } from "react-icons/gr"
import { FaMapMarkerAlt } from "react-icons/fa"
import { CgSandClock } from "react-icons/cg"
import { TbClockFilled } from "react-icons/tb"
import { FaRegPaperPlane } from "react-icons/fa"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "@/components/shared/ui/AnimatedModal"
import CompanyDefault from "@/assets/CompanyDefault.png"
import { FaArrowUpRightFromSquare } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router"
import { PiMedalFill } from "react-icons/pi"
import { FaUsers } from "react-icons/fa"
import { MdWorkHistory } from "react-icons/md"
import { PiFoldersFill } from "react-icons/pi"
import { Button } from "@/components/shared/Button"
import { useQuery } from "@tanstack/react-query"
import { companyApi, jobApi, resumeApi } from "@/apis"
import { experience, jobFields, salary } from "@/features/filter/data"
import FroalaViewComponent from "@/components/shared/froalaEditorViewComponent"
import { useMemo, useState } from "react"
import _ from "lodash"
import { useAuth } from "@/hooks/useAuth"
import { RadioGroup, RadioGroupItem } from "@/components/shared/RadioGroup"
import { formatDate } from "@/config"
import { EyeIcon } from "lucide-react"

export const Job = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { jobId, companyId } = useParams()
  const [resumeId, setResumeId] = useState<number>()
  const { data: jobData } = useQuery({
    queryKey: ["Jobs", jobId],
    queryFn: () => jobApi.getJobById(Number(jobId)),
    refetchInterval: (query) => {
      const currentStatus = query.state?.data
      if (currentStatus) {
        return false
      }
      return 300000 // 5 minutes
    },
  })

  const { data: companyData } = useQuery({
    queryKey: ["Companies", companyId],
    queryFn: () => companyApi.getCompanyById(Number(companyId)),
    refetchInterval: (query) => {
      const currentStatus = query.state?.data
      if (currentStatus) {
        return false
      }
      return 300000 // 5 minutes
    },
  })

  const jobFieldArr = useMemo(() => _.split(companyData?.DT.field, "-"), [companyData?.DT.field])

  const getMyResume = useQuery({
    queryKey: ["getMyResume"],
    queryFn: resumeApi.getResumeByEmployee,
    enabled: isLoggedIn,
    refetchOnMount: true,
  })
  console.log("getMyResume", getMyResume.data)

  console.log("jobId", jobId, jobData)
  return (
    <div className="mt-5 grid h-full w-screen grid-cols-6 gap-6 bg-background px-[106px]">
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
          <Modal>
            <ModalTrigger className="group/modal-btn mt-4 flex w-full items-center justify-center rounded-md bg-navTitle py-2 font-semibold text-white">
              <div className="absolute inset-0 z-20 flex -translate-x-full items-center justify-center text-white transition duration-500 group-hover/modal-btn:translate-x-0">
                <FaRegPaperPlane size={20} />
              </div>
              <span className="text-center transition duration-500 group-hover/modal-btn:translate-x-[1000px]">
                Ứng tuyển ngay
              </span>
            </ModalTrigger>
            <ModalBody className="min-w-[648px] px-8">
              <ModalContent className="w-full justify-start p-0">
                <div className="flex w-full flex-col">
                  <span className="mb-9 text-lg font-bold text-black">
                    Ứng tuyển <span className="text-navTitle">{jobData?.DT.title}</span>
                  </span>
                  <span className="flex text-[16px] font-semibold text-black">
                    <PiFoldersFill size={20} className="mr-2 text-navTitle" /> Chọn CV để ứng tuyển
                  </span>
                  <div className="mt-5 flex w-full flex-col">
                    <RadioGroup
                      defaultValue={getMyResume.data?.DT[0].id}
                      onValueChange={(value) => setResumeId(Number(value))}
                    >
                      {!getMyResume.isLoading &&
                        getMyResume.data?.DT.map((resume) => (
                          <div className="mb-2 flex w-full items-center justify-between rounded-md bg-white py-2">
                            <div className="flex items-center gap-4">
                              <RadioGroupItem value={resume.id} id={resume.id} />
                              <span className="text-black">{resume.name}</span>
                              <EyeIcon
                                onClick={() => window.open(`/manage-resume/${resume.id}`)}
                                size={20}
                                className="cursor-pointer rounded-full border-[1px] bg-white text-black transition-all hover:bg-slate-400"
                              />
                            </div>
                            <span className="text-base font-light text-black">{formatDate(resume.updatedAt)}</span>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>
                </div>
              </ModalContent>
              <ModalFooter className="flex w-full gap-3 bg-white">
                <Button className="rounded-md bg-backgroundColor px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-gray-300">
                  Hủy
                </Button>
                <Button className="w-full rounded-md bg-navTitle py-2 text-center font-semibold text-white transition-all hover:bg-green-700">
                  Nộp hồ sơ ứng tuyển
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
        <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
          <span className="border-l-4 border-navTitle pl-[10px] text-xl font-bold text-black">
            Chi tiết tin tuyển dụng
          </span>
          <span className="mb-2 mt-6 text-[16px] font-semibold text-black">Mô tả công việc</span>
          <FroalaViewComponent model={jobData?.DT.description} />
          <span className="mb-2 mt-6 text-[16px] font-semibold text-black">Yêu cầu công việc</span>
          <FroalaViewComponent model={jobData?.DT.requirements} />
        </div>
      </div>
      <div className="col-span-2 flex w-full flex-col gap-6">
        <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
          <div className="flex">
            <img src={CompanyDefault} className="mr-2 h-[74px] w-[74px] cursor-pointer" />
            <span className="text-[16px] font-semibold text-black">{companyData?.DT.companyName}</span>
          </div>
          <div className="mt-3 flex items-center">
            <span className="mr-4 text-companyJobCard">Quy mô:</span>
            <span className="font-medium text-black">1000+ nhân viên</span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="mr-4 text-companyJobCard">Lĩnh vực:</span>
            {jobFieldArr.map((job) =>
              jobFields
                .filter((jobField) => jobField.key === job)
                .map((jobField) => <span className="mr-1 font-medium text-black">{jobField.label}</span>),
            )}
          </div>
          <div className="mt-2 flex items-center">
            <span className="mr-4 text-companyJobCard">Địa điểm:</span>
            <span className="font-medium text-black">{companyData?.DT.location}</span>
          </div>
          <span
            onClick={() => navigate(`/cong-ty/${companyId}`)}
            className="mt-4 flex w-full cursor-pointer items-center justify-center text-center text-sm font-semibold text-navTitle"
          >
            Xem trang công ty
            <FaArrowUpRightFromSquare size={16} className="ml-2" />
          </span>
        </div>
        <div className="flex w-full flex-col rounded-md bg-white px-6 py-5">
          <span className="font-bold text-black">Thông tin chung</span>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
              <PiMedalFill className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-black">Cấp bậc</span>
              <span className="text-sm font-semibold text-black">Nhân viên</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
              <CgSandClock className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-black">Kinh nghiệm</span>
              <span className="text-sm font-semibold text-black">Dưới 1 năm</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
              <FaUsers className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-black">Số lượng tuyển</span>
              <span className="text-sm font-semibold text-black">5 người</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-iconJob p-2">
              <MdWorkHistory className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-black">Hình thức làm việc</span>
              <span className="text-sm font-semibold text-black">{jobData?.DT.jobType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
