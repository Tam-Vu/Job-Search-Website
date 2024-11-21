import { useFilterSlice } from "@/features/filter/store"
import { selectType } from "@/features/filter/store/selectors"
import { Filter, FilterWithKeyAndName } from "@/type"
import { useEffect, useRef, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { useDispatch, useSelector } from "react-redux"

export const SliderTab = ({ filterData }: { filterData: Filter[] | FilterWithKeyAndName[] }) => {
  const tabsBoxRef = useRef<HTMLUListElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dispatch = useDispatch()
  const { actions: filterAction } = useFilterSlice()
  const getType = useSelector(selectType)
  console.log("GetType", getType)
  useEffect(() => {
    const tabsBox = tabsBoxRef.current
    const arrowIcons = document.querySelectorAll(".icon .icon-child")
    console.log("arrowIcons", arrowIcons)
    const handleIcons = (scrollVal: number) => {
      if (!tabsBox) return
      console.log("scrollVal", scrollVal)
      const maxScrollableWidth = tabsBox.scrollWidth - tabsBox.clientWidth
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
        console.log("tabox", tabsBox)
        console.log("IconId", icon)
        if (tabsBox) {
          const scrollWidth = (tabsBox.scrollLeft += icon.id === "left" ? -340 : 340)
          handleIcons(scrollWidth)
        }
      })
    })

    const dragStop = () => setIsDragging(false)

    if (tabsBox) {
      tabsBox.addEventListener("mousedown", () => setIsDragging(true))
      document.addEventListener("mouseup", dragStop)
    }

    return () => {
      arrowIcons.forEach((icon) => icon.removeEventListener("click", () => {}))
      if (tabsBox) {
        tabsBox.removeEventListener("mousedown", () => setIsDragging(true))
      }
      document.removeEventListener("mouseup", dragStop)
    }
  }, [isDragging])

  return (
    <div className="flex max-w-[809px] items-center">
      <div className="icon group mr-3 cursor-pointer rounded-full border-2 border-navTitle bg-transparent p-2 transition-all hover:bg-navTitle">
        <FaChevronLeft
          key="left"
          id="left"
          strokeWidth="1"
          className="icon-child cursor-pointer text-black transition-all group-hover:text-white"
        />
      </div>
      <ul ref={tabsBoxRef} className="tabs-box flex list-none gap-3 overflow-x-hidden scroll-smooth">
        {filterData &&
          filterData.map((value) => (
            <li
              onClick={() => dispatch(filterAction.updateType(value.key))}
              className={`tab cursor-pointer whitespace-nowrap rounded-full border-2 px-[9px] py-[12px] text-sm font-medium transition-all ${getType === value.key ? "bg-navTitle text-white" : "bg-tabBG text-black hover:border-2 hover:border-navTitle hover:bg-white"}`}
            >
              {("name" in value && value.name) || ("label" in value && value.label)}
            </li>
          ))}
      </ul>
      <div className="icon group ml-3 cursor-pointer rounded-full border-2 border-navTitle bg-transparent p-2 transition-all hover:bg-navTitle">
        <FaChevronRight
          key="right"
          id="right"
          className="icon-child cursor-pointer text-black transition-all group-hover:text-white"
        />
      </div>
    </div>
  )
}
