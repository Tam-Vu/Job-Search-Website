/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSelector } from "@reduxjs/toolkit"
// import _ from "lodash"
import { Filter } from "../interface"

export const initialState: Filter = {
  category: "address",
  valueType: "TPHCM",
}

const selectDomain = (state: any) => state.filter || initialState
// const selectPath = (_state: any, path: any) => path

export const selectCategory = createSelector([selectDomain], (state: Filter) => state.category)
export const selectType = createSelector([selectDomain], (state: Filter) => state.valueType)
