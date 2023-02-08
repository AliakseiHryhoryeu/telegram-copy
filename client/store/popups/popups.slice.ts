import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IPopupsState } from './popups.types'

const LocalStorageFolder = 'Theme'

const initialState: IPopupsState = {
	// theme: Parsed.theme || 'dark',
	main: false,
	taskUpdate: false,
}

export const popupsSlice = createSlice({
	name: 'popupsSlice',
	initialState,
	reducers: {
		toggleMainPopup: state => {
			state.main = !state.main
		},
		toggleTaskUpdatePopup: state => {
			state.taskUpdate = !state.taskUpdate
		},
	},
})

export const popupsReducer = popupsSlice.reducer
export const popupsActions = popupsSlice.actions
