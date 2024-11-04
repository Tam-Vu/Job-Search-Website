import { Filter } from "@/components/Filter/Filter"
import { JobCard } from "@/components/JobCard"
import { sampleData } from "./SampleJobData"
import { useSelector } from "react-redux"
import { selectCategory, selectType } from "@/features/filter/store/selectors"
import { useMemo } from "react"
import { address, experience, jobs, salary } from "@/features/filter/data"

export const Home = () => {
  const category = useSelector(selectCategory)
  const typeValue = useSelector(selectType)

  const filterArr = useMemo(() => {
    switch (category) {
      case "address":
        return address
      case "salary":
        return salary
      case "experiece":
        return experience
      case "jobs":
        return jobs
      default:
        return [
          {
            key: "",
            name: "",
          },
        ]
    }
  }, [category])

  const filterJobData = useMemo(() => {
    const filterType = filterArr.filter((val) => val.key === typeValue)
    if (filterType[0].key === "all") return sampleData
    return sampleData.filter((data) => {
      if (category === "address") return data.address === filterType[0].key
      else if (category === "salary") {
        return data.salary === filterType[0].key
      } else if (category === "experiece") return data.experience === filterType[0].key
      else return data.job === filterType[0].key
    })
  }, [category, filterArr, typeValue])

  return (
    <div className="flex h-full w-screen flex-col items-center bg-background px-[106px]">
      <div className="flex w-full flex-col">
        <Filter></Filter>
        <div className="flex flex-wrap gap-5">
          {filterJobData &&
            filterJobData.map((data, index) => (
              <JobCard
                key={index}
                jobName={data.jobName}
                companyName={data.companyName}
                salary={data.salary}
                address={data.address}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
