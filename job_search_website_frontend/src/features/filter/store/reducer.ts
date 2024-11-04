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
  },
})

export const { actions, name: key, reducer } = slice
