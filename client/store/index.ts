import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { themeReducer } from './theme/theme.slice'
import { popupsReducer } from './popups/popups.slice'
import { userReducer } from './user/user.slice'

import { userApi } from './user/user.api'

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		popups: popupsReducer,
		user: userReducer,
		[userApi.reducerPath]: userApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(userApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
