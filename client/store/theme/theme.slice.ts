import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IThemeState } from './theme.types'

const LocalStorageFolder = 'Theme'
// const getParsed = () => {
// 	if (localStorage === undefined) {
// 		let Parsed: IThemeState = { theme: 'dark' }
// 		return Parsed
// 	}
// 	const data = localStorage.getItem(LocalStorageFolder) || '{}'
// 	if (data == '{}') {
// 		const Parsed: IThemeState = { theme: 'dark' }
// 		return Parsed
// 	}
// 	let Parsed: IThemeState = JSON.parse(data)
// 	if (typeof Parsed == undefined || Parsed == null) {
// 		Parsed = { theme: 'dark' }
// 	}
// 	return Parsed
// }
// const Parsed: IThemeState = getParsed()

const initialState: IThemeState = {
	// theme: Parsed.theme || 'dark',
	theme: 'light',
	// bgColor: '#f5f7f8',
	// particleColor: '#A850FF',
}

export const themeSlice = createSlice({
	name: 'themeSlice',
	initialState,
	reducers: {
		toggleTheme: state => {
			if (state.theme == 'dark') {
				state.theme = 'light'
				// state.bgColor = '#f5f7f8'
				// state.particleColor = '#A850FF'
			} else {
				state.theme = 'dark'
				// state.bgColor = '#18181a'
				// state.particleColor = '#00E0FF'
			}
			localStorage.setItem(LocalStorageFolder, JSON.stringify(state))

			// localStorage.setItem(LocalStorageFolder, JSON.stringify(state.theme))
		},
		getTheme: (state, action: PayloadAction<{}>) => {
			// let Parsed: IThemeState = JSON.parse(
			// 	localStorage.getItem(LocalStorageFolder) || '{}'
			// )
			// if (
			// 	typeof localStorage.getItem(LocalStorageFolder) == undefined ||
			// 	localStorage.getItem(LocalStorageFolder) == null
			// ) {
			// 	Parsed = { theme: 'dark', bgColor: '#18181a', particleColor: '#00E0FF' }
			// }
			// state.theme = Parsed.theme
			// state.bgColor = Parsed.bgColor
			// state.particleColor = Parsed.particleColor
		},
	},
})

export const themeReducer = themeSlice.reducer
export const themeActions = themeSlice.actions
