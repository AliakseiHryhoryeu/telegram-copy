import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../'

import { userApi } from './user.api'
import { IUserState } from './user.types'

const initialState: IUserState = {
	activeUser: {
		email: '',
		username: '',
	},
	token: '',
	isAuth: true,
}

export const userSlice = createSlice({
	name: 'userSlice',
	initialState,
	reducers: {
		logout: (state, action: PayloadAction<null>) => {
			localStorage.removeItem('token')
			state.activeUser.username = ''
			state.activeUser.email = ''
			state.token = ''
		},

		// Settings
		updateToken: (state, action: PayloadAction<null>) => {
			try {
				state.token = localStorage.getItem('token') || ''
			} catch (e) {
				console.log(e)
			}
		},
	},
	extraReducers: builder => {
		builder.addMatcher(
			userApi.endpoints.login.matchFulfilled,
			(state, { payload }) => {
				console.log(payload)
				// state.token = payload.user.token
				// state.activeUser.email = payload.user.email
				// state.activeUser.id = payload.user.userId
				// state.activeUser.username = payload.user.username
				// localStorage.setItem('token', payload.user.token)
				state.isAuth = true
			}
		),
			builder.addMatcher(
				userApi.endpoints.auth.matchFulfilled,
				(state, { payload }) => {
					// state.token = payload.user.token
					// state.activeUser.email = payload.user.email
					// state.activeUser.id = payload.user.userId
					// state.activeUser.username = payload.user.username
					// localStorage.setItem('token', payload.user.token)
				}
			),
			builder.addMatcher(
				userApi.endpoints.signup.matchFulfilled,
				(state, { payload }) => {
					// state.token = payload.user.token
					// state.activeUser.email = payload.user.email
					// state.activeUser.id = payload.user.userId
					// state.activeUser.username = payload.user.username
					// localStorage.setItem('token', payload.user.token)
				}
			)
	},
})

export default userSlice.reducer
export const userReducer = userSlice.reducer
export const userActions = userSlice.actions

export const { logout, updateToken } = userSlice.actions

// export const selectCurrentUser = (state: RootState) => state.user.activeUser
