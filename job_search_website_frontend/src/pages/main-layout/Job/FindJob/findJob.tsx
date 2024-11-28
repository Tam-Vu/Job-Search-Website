import { jobApi } from "@/apis"
import { JobCard } from "@/components/JobCard"
import { selectIndustry, selectJobField, selectPosition, selectSearch } from "@/features/filter/store/selectors"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useSelector } from "react-redux"

export const FindJob = () => {
  const search = useSelector(selectSearch)
  const jobField = useSelector(selectJobField)
  const industry = useSelector(selectIndustry)
  const position = useSelector(selectPosition)
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
  const filterJobData = useMemo(() => {
    let filterArr = getAllJobs?.DT
    if (search !== "") {
      filterArr = (filterArr || []).filter((val) => val.title.toLowerCase().includes(search))
    }
    if (jobField !== "") {
      filterArr = (filterArr || []).filter((val) => val.jobField === jobField)
    }
    if (industry !== "") {
      filterArr = (filterArr || []).filter((val) => val.industry === industry)
    }
    if (position !== "") {
      filterArr = (filterArr || []).filter((val) => val.professionalPosition === position)
    }
    return filterArr
  }, [getAllJobs?.DT, industry, jobField, position, search])
  return (
    <div className="flex w-full flex-grow flex-col px-[106px]">
      <div className="flex min-h-screen flex-wrap gap-5">
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
  )
}
