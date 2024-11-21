import { Filter } from "@/components/Filter/Filter"
import { JobCard } from "@/components/JobCard"
import { useSelector } from "react-redux"
import { selectCategory, selectType } from "@/features/filter/store/selectors"
import { useMemo } from "react"
import { address, experience, jobFields, salary } from "@/features/filter/data"
import { AuroraBackground } from "@/components/shared/ui/AnimatedBackground"
import { FlipWords } from "@/components/shared/ui/Flipword"
import { PlaceholdersAndVanishInput } from "@/components/shared/ui/VanishedInput"
import Ticker from "@/components/shared/ui/Ticker"
import { JobFieldSlider } from "@/components/Filter/SliderTab/JobFieldSlider"
import { useQuery } from "@tanstack/react-query"
import { jobApi } from "@/apis"
import { useAuth } from "@/hooks/useAuth"

export const Home = () => {
  const { isLoggedIn } = useAuth()
  console.log("isLoggedIn", isLoggedIn)
  const words = useMemo(() => ["nhanh", "uy tín", "phù hợp", "đa dạng", "ổn định"], [])
  const placeholders = [
    "Tìm kiếm việc làm bạn cần >.<",
    "Nhân viên kinh doanh",
    "Trưởng phòng marketing",
    "Fullstack Developer",
    "Giáo viên",
  ]
  const category = useSelector(selectCategory)
  const typeValue = useSelector(selectType)
  console.log("typeValue", typeValue)
  const filterArr = useMemo(() => {
    switch (category) {
      case "address":
        return address
      case "salary":
        return salary
      case "experience":
        return experience
      case "jobs":
        return jobFields
      default:
        return [
          {
            key: "",
            name: "",
          },
        ]
    }
  }, [category])

  const { data: getAllJobs } = useQuery({
    queryKey: ["AllJobs"],
    queryFn: () => jobApi.getAllJob(),
    refetchInterval: (query) => {
      const currentStatus = query.state?.data
      if (currentStatus) {
        return false
      }
      return 300000 // 5 minutes
    },
  })

  console.log("filterArr", filterArr)
  const filterJobData = useMemo(() => {
    const filterType = filterArr.filter((val) => val.key === typeValue)
    console.log("filterType", filterType)
    if (filterType[0]?.key === "all") return getAllJobs?.DT || []
    return (getAllJobs?.DT || []).filter((data) => {
      if (category === "address") return data.location === filterType[0].key
      else if (category === "salary") {
        return data.salaryRange === filterType[0].key
      } else if (category === "experience") return data.experience === filterType[0].key
      else return data.jobField === filterType[0].key
    })
  }, [category, filterArr, getAllJobs, typeValue])
  console.log("getAllJobs", getAllJobs, filterJobData)
  return (
    <div className="flex h-full w-screen flex-col items-center gap-2 bg-background p-0">
      <AuroraBackground className="m-0 min-h-[331px] flex-shrink px-[106px]">
        <div className="flex flex-col text-2xl font-bold text-navTitle">
          <span className="w-full text-center">
            Tìm việc làm
            <FlipWords words={words} />
          </span>
          Việc làm mới nhất 24h trên toàn quốc.
        </div>
        <span className="mb-4 mt-[6px] flex w-full items-center justify-center text-center text-xs text-white">
          Tiếp cận
          <span className="mx-1 flex text-sm font-semibold">
            <Ticker className="text-sm font-semibold text-white" value="456" />+
          </span>
          tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
        </span>
        <PlaceholdersAndVanishInput placeholders={placeholders} />
        <JobFieldSlider filterData={jobFields} />
      </AuroraBackground>
      <div className="flex w-full flex-grow flex-col px-[106px]">
        <Filter></Filter>
        <div className="flex flex-wrap gap-5">
          {filterJobData &&
            filterJobData.map((data, index) => (
              <JobCard
                key={index}
                id={data.id}
                jobName={data.title}
                companyName={data.employer.companyName}
                companyId={data.employer.id}
                salary={data.salaryRange}
                address={data.location}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
