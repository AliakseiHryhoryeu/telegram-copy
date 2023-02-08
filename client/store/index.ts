import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { themeReducer } from './theme/theme.slice'
import { popupsReducer } from './popups/popups.slice'

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		popups: popupsReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
