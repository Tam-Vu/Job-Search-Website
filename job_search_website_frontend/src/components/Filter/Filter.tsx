import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/Layout/Components/Select"
import { address, category, experience, jobs, salary } from "@/features/filter/data"
import { IoFilter } from "react-icons/io5"
import { SliderTab } from "./SliderTab/SliderTab"
import { useDispatch, useSelector } from "react-redux"
import { useFilterSlice } from "@/features/filter/store"
import { findCategory } from "@/features/filter/helpers"
import { selectCategory } from "@/features/filter/store/selectors"
import { useMemo } from "react"

export const Filter = () => {
  const dispatch = useDispatch()
  const { actions: filterAction } = useFilterSlice()
  const categoryKey = useSelector(selectCategory)
  const getCategoryValue = useMemo(() => findCategory(categoryKey, "key"), [categoryKey])
  console.log("FindCate", categoryKey, getCategoryValue)
  const filterData = useMemo(() => {
    switch (categoryKey) {
      case "address":
        return address
      case "salary":
        return salary
      case "experience":
        return experience
      case "job":
        return jobs
      default:
        return [
          {
            key: "",
            name: "",
          },
        ]
    }
  }, [categoryKey])

  const resetfilterType = (key: string) => {
    switch (key) {
      case "address":
        return address[0].key
      case "salary":
        return salary[0].key
      case "experience":
        return experience[0].key
      case "job":
        return jobs[0].key
      default:
        return ""
    }
  }
  return (
    <div className="flex flex-col">
      <div className="mt-6 flex w-full items-center justify-between">
        <span className="text-2xl font-bold text-navTitle">Việc làm tốt nhất</span>
        <span className="cursor-pointer text-sm font-medium text-black underline">Xem tat ca</span>
      </div>
      <div className="flex w-full items-center justify-between">
        <Select
          onValueChange={(value) => {
            const category = findCategory(value, "name")
            console.log("category", category)
            dispatch(filterAction.updateCategory(category[0].key))
            dispatch(filterAction.updateType(resetfilterType(category[0].key)))
          }}
          defaultValue={getCategoryValue[0].name}
        >
          <SelectTrigger className="border-comboboxBorder mr-[53px] min-w-[278px] rounded-lg border-2 bg-white text-black">
            <div className="flex items-center">
              <IoFilter size={14} className="mr-2 text-filter" />
              <span className="mr-2 text-sm font-medium text-filter">Lọc theo</span>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-md bg-white shadow-lg">
            <SelectGroup>
              {category.map((i) => (
                <SelectItem
                  className="text-sm text-black hover:text-navTitle focus:text-navTitle"
                  key={i.key}
                  value={i.name}
                >
                  {i.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <SliderTab filterData={filterData} />
      </div>
    </div>
  )
}
