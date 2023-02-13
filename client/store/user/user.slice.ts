import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../'

import { userApi } from './user.api'
import { IUserState } from './user.types'

import { emptyState } from './user.types'

const initialState: IUserState = {
	activeUser: {
		username: '',
		email: '',
		tasks: [],
		contacts: {
			pending: [],
			requests: [],
			added: [],
		},
	},
	token: '',
	isAuth: false,
}

export const userSlice = createSlice({
	name: 'userSlice',
	initialState,
	reducers: {
		logout: state => {
			localStorage.removeItem('token')
			state = emptyState
		},

		// Settings
		updateToken: state => {
			try {
				state.token = localStorage.getItem('token') || ''
			} catch (e) {
				console.log(e)
			}
		},
	},
	extraReducers: builder => {
		builder.addMatcher(
			// AUTH
			userApi.endpoints.auth.matchFulfilled,
			(state, { payload }) => {
				if (payload.success) {
					state.activeUser = payload.data.user
					state.isAuth = true
					state.token = payload.data.token.access_token
					try {
						localStorage.setItem('token', payload.data.token.access_token)
					} catch (e) {
						console.log(e)
					}
				} else {
					console.log(payload?.message)
				}
			}
		),
			builder.addMatcher(
				// LOGIN
				userApi.endpoints.login.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser = payload.data.user
						state.isAuth = true
						state.token = payload.data.token.access_token
						try {
							localStorage.setItem('token', payload.data.token.access_token)
						} catch (e) {
							console.log(e)
						}
					} else {
						console.log(payload?.message)
					}
				}
			),
			builder.addMatcher(
				// SIGNUP
				userApi.endpoints.signup.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser = payload.data.user
						state.isAuth = true
						state.token = payload.data.token.access_token
						try {
							localStorage.setItem('token', payload.data.token.access_token)
						} catch (e) {
							console.log(e)
						}
					} else {
						console.log(payload?.message)
					}
				}
			),
			builder.addMatcher(
				// CHANGE PASSWORD
				userApi.endpoints.changePassword.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser = payload.data.user
					} else {
						console.log(payload?.message)
					}
				}
			),
			builder.addMatcher(
				// CHANGE USERNAME
				userApi.endpoints.changeUsername.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser = payload.data.user
					} else {
						console.log(payload?.message)
					}
				}
			),
			builder.addMatcher(
				// CHANGE EMAIL
				userApi.endpoints.changeEmail.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser = payload.data.user
					} else {
						console.log(payload?.message)
					}
				}
			),
			builder.addMatcher(
				// CONTACT ACCEPT
				userApi.endpoints.contactAccept.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser.contacts = payload.data.contacts
					} else {
						console.log(payload?.message)
					}
				}
			),
			builder.addMatcher(
				// CONTACT REQUEST
				userApi.endpoints.contactRequest.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser.contacts = payload.data.contacts
					} else {
						console.log(payload?.message)
					}
				}
			),
			builder.addMatcher(
				// CONTACT REJECT
				userApi.endpoints.contactReject.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser.contacts = payload.data.contacts
					} else {
						console.log(payload?.message)
					}
				}
			),
			builder.addMatcher(
				// CONTACT DELETE
				userApi.endpoints.contactDelete.matchFulfilled,
				(state, { payload }) => {
					if (payload.success) {
						state.activeUser.contacts = payload.data.contacts
					} else {
						console.log(payload?.message)
					}
				}
			)
	},
})

export default userSlice.reducer
export const userReducer = userSlice.reducer
export const userActions = userSlice.actions

export const { logout, updateToken } = userSlice.actions

// export const selectCurrentUser = (state: RootState) => state.user.activeUser
