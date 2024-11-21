import { createSlice } from "@reduxjs/toolkit"

import { initialState } from "./selectors"

const slice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateCategory(state, action) {
      console.log("Action", action.payload)
      state.category = action.payload
    },
    updateType(state, action) {
      state.valueType = action.payload
    },
    updateSearch(state, action) {
      state.search = action.payload
    },
    updateJobField(state, action) {
      state.jobField = action.payload
    },
    updateIndustry(state, action) {
      state.industry = action.payload
    },
    updatePosition(state, action) {
      state.position = action.payload
    },
  },
})

export const { actions, name: key, reducer } = slice
