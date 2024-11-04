import { useInjectReducer } from "redux-injectors"

import { actions, key, reducer } from "./reducer"

export const useFilterSlice = () => {
  useInjectReducer({ key, reducer })
  return { actions }
}
