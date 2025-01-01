import { Filter } from "@/type"
import { category } from "../data"

export const findCategory = (key: string, type: string) => {
  return category.filter((value) => {
    if (type === "key") return value.key === key
    else return value.name === key
  })
}

export const findType = (key: string, type: string, typeArray: Filter[]) => {
  return typeArray.filter((value) => {
    if (type === "key") return value.key === key
    else return value.label === key
  })
}
