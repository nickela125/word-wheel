import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
}

export const instructionsOpenSlice = createSlice({
  name: 'instructions-open',
  initialState,
  reducers: {    
    toggleOpen: (state) => {
        state.isOpen = !state.isOpen;
      }
  },
})

// Action creators are generated for each case reducer function
export const { toggleOpen } = instructionsOpenSlice.actions

export default instructionsOpenSlice.reducer