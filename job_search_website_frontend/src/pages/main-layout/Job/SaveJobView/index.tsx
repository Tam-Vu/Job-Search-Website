import { applicationApi } from "@/apis"
import { JobCard } from "@/components/JobCard"
import { useQuery } from "@tanstack/react-query"

export const SaveJobView = () => {
  const filterJobData = useQuery({
    queryKey: ["getMyApplication"],
    queryFn: () => applicationApi.getMyApplication(),
    refetchOnMount: true,
  })
  return (
    <div className="flex h-full w-screen flex-col items-center gap-2 bg-background p-0">
      <div className="mt-4 flex w-full flex-grow flex-col px-[106px]">
        <span className="text-2xl font-bold text-navTitle">Việc làm đã ứng tuyển</span>
        <div className="flex min-h-screen flex-wrap gap-5">
          {!filterJobData.isLoading &&
            (filterJobData.data?.DT ?? []).map((data, index) => (
              <JobCard
                key={index}
                id={data.jobId}
                jobName={data.job.title}
                companyName={data.job.employer.companyName}
                companyId={data.job.employer.id}
                salary="10_15"
                address={data.status}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
