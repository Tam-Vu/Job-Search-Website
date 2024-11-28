import CompanyDefault from "@/assets/CompanyDefault.png"
import "./style.css"
import { useNavigate } from "react-router"
import { useMemo } from "react"
import { address, salary } from "@/features/filter/data"
import { useAuth } from "@/hooks/useAuth"

export const JobCard = ({
  id,
  jobName,
  companyName,
  salary: salarykey,
  address: addressKey,
  companyId,
}: {
  companyId: number
  id: number
  jobName: string
  companyName: string
  salary: string
  address: string
}) => {
  const { isLoggedIn } = useAuth()
  console.log("isLoggedIn", isLoggedIn)
  const navigate = useNavigate()
  const salaryName = useMemo(() => salary.filter((val) => val.key === salarykey), [salarykey])
  const addressName = useMemo(() => address.filter((val) => val.key === addressKey), [addressKey])
  console.log("addressName", addressName)
  return (
    <div className="flex max-h-[110px] w-[370px] rounded-md bg-white p-3 shadow-lg">
      <img src={CompanyDefault} className="mr-2 h-[78px] w-[78px] cursor-pointer" />
      <div className="flex flex-col">
        <span
          onClick={() => navigate(`/job/${id}/${companyId}`)}
          className="post_content cursor-pointer text-wrap text-sm font-semibold text-black"
        >
          {jobName}
        </span>
        <span
          onClick={() => navigate(`/cong-ty/${companyId}`)}
          className="post_content cursor-pointer text-xs font-medium text-companyJobCard"
        >
          {companyName}
        </span>
        <div className="mt-4 flex">
          <div className="mr-3 cursor-pointer rounded-md bg-filterBg px-2 py-1 text-[11px] text-black">
            {salaryName[0].name}
          </div>
          <div className="cursor-pointer rounded-md bg-filterBg px-2 py-1 text-[11px] text-black">
            {addressName.length > 0 && addressName[0]?.name ? addressName[0].name : addressKey}
          </div>
        </div>
      </div>
    </div>
  )
}
