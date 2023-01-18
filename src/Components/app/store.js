import { configureStore } from '@reduxjs/toolkit'
import instructionsOpenReducer from '../../slices/instructionsOpenSlice'

export const store = configureStore({
  reducer: {
    instructionsOpen: instructionsOpenReducer,
  },
})