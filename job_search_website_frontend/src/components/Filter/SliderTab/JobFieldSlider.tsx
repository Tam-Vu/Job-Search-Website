// import { useFilterSlice } from "@/features/filter/store"
import { Filter } from "@/type"
import { useEffect, useRef, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import "./style.css"
import { Industries, professionalPosition } from "@/features/filter/data"
// import { useDispatch } from "react-redux"

export const JobFieldSlider = ({ filterData }: { filterData: Filter[] }) => {
  const jobFieldtabsBoxRef = useRef<HTMLUListElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [field, setField] = useState<string | undefined>()
  //   const dispatch = useDispatch()
  //   const { actions: filterAction } = useFilterSlice()
  useEffect(() => {
    const jobFieldtabsBox = jobFieldtabsBoxRef.current
    const arrowIcons = document.querySelectorAll(".jobFieldIcon .jobFieldIcon-child")
    console.log("jobFieldIcon", arrowIcons)
    const handleIcons = (scrollVal: number) => {
      if (!jobFieldtabsBox) return
      console.log("scrollVal", scrollVal)
      const maxScrollableWidth = jobFieldtabsBox.scrollWidth - jobFieldtabsBox.clientWidth
      if (arrowIcons[0]?.parentElement) {
        arrowIcons[0].parentElement.style.display = scrollVal <= 0 ? "none" : "flex"
      }
      console.log("arrowIcons[1]", arrowIcons[1] instanceof HTMLElement)
      if (arrowIcons[1]?.parentElement) {
        arrowIcons[1].parentElement.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex"
      }
    }

    arrowIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        console.log("jobFieldIconClick", jobFieldtabsBox)
        console.log("IconId", icon)
        if (jobFieldtabsBox) {
          const scrollWidth = (jobFieldtabsBox.scrollLeft += icon.id === "jobFieldIconleft" ? -340 : 340)
          handleIcons(scrollWidth)
        }
      })
    })

    const dragStop = () => setIsDragging(false)

    if (jobFieldtabsBox) {
      jobFieldtabsBox.addEventListener("mousedown", () => setIsDragging(true))
      document.addEventListener("mouseup", dragStop)
    }

    return () => {
      arrowIcons.forEach((icon) => icon.removeEventListener("click", () => {}))
      if (jobFieldtabsBox) {
        jobFieldtabsBox.removeEventListener("mousedown", () => setIsDragging(true))
      }
      document.removeEventListener("mouseup", dragStop)
    }
  }, [isDragging])

  return (
    <div className="z-30 mt-4 flex w-full items-center bg-transparent">
      <div className="jobFieldIcon group mr-3 cursor-pointer rounded-full border-2 border-navTitle bg-Aurora p-2 transition-all hover:bg-navTitle">
        <FaChevronLeft
          key="jobFieldIconleft"
          id="jobFieldIconleft"
          strokeWidth="1"
          className="jobFieldIcon-child cursor-pointer text-navTitle transition-all group-hover:text-white"
        />
      </div>
      <ul ref={jobFieldtabsBoxRef} className="tabs-box relative flex list-none gap-3 overflow-x-hidden scroll-smooth">
        {filterData &&
          filterData.map((value) => (
            <li
              key={value.key}
              title={value.name}
              onMouseEnter={() => {
                setField(value.key)
                setIsHovered(true)
              }}
              onMouseLeave={() => setIsHovered(false)}
              //   onClick={() => dispatch(filterAction.updateType(value.key))}
              className={`tab min-w-[219px] cursor-pointer truncate rounded-full border-0 bg-JobField px-[24px] py-[12px] text-center text-sm font-semibold text-white transition-all hover:bg-JobFieldImage`}
            >
              {value.name}
            </li>
          ))}
      </ul>
      {isHovered && (
        <div
          className="filterOverlay absolute top-3/4 z-40 translate-y-9 rounded-xl border bg-white p-4 shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex h-[350px] w-full flex-col overflow-hidden">
            <div className="flex w-full border-b-[1px] border-gray-300 px-6 py-[10px]">
              <div className="mr-5 w-[200px] text-sm font-normal text-gray-500">NGHỀ</div>
              <div className="w-full text-sm font-normal text-gray-500">VỊ TRÍ CHUYÊN MÔN</div>
            </div>
            <div className="flex flex-col overflow-y-auto">
              {field &&
                Industries &&
                professionalPosition &&
                Industries.filter((industry) => industry.jobField === field).map((industry) => (
                  <div className="flex w-full border-b-[1px] border-gray-300 px-6 py-[10px]" key={industry.key}>
                    <div className="mr-5 w-[200px] cursor-pointer text-wrap text-sm font-semibold text-black hover:text-navTitle">
                      {industry.name}
                    </div>
                    <div className="flex w-full flex-wrap gap-5">
                      {professionalPosition
                        .filter((position) => position.jobField === field && position.jobs === industry.key)
                        .map((position) => (
                          <span className="cursor-pointer rounded-full bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300">
                            {position.name}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      <div className="jobFieldIcon group ml-3 cursor-pointer rounded-full border-2 border-navTitle bg-Aurora p-2 transition-all hover:bg-navTitle">
        <FaChevronRight
          key="jobFieldIconright"
          id="jobFieldIconright"
          className="jobFieldIcon-child cursor-pointer text-navTitle transition-all group-hover:text-white"
        />
      </div>
    </div>
  )
}
