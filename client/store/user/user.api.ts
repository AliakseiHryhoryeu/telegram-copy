import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../'

// import { IList } from '../list/list.types'
// import { ITask } from '../task/task.types'

const serverIp = process.env.NEXT_PUBLIC_SERVER_IP
const baseUrl = serverIp + 'api/user'
console.log(serverIp)
export interface IUserResponse {
	userId: string
	email: string
	username: string
	token: string
}

export interface IAuthResponse {
	user: IUserResponse
	// lists: IList[]
	// tasks: ITask[]
}

export interface ILoginResponse {
	user: IUserResponse
	// lists: IList[]
	// tasks: ITask[]
}

export interface ISignUpResponse {
	user: IUserResponse
}

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: baseUrl,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).user.token
			if (token) {
				headers.set('authorization', `Bearer ${token}`)
			}
			return headers
		},
	}),
	endpoints: build => ({
		// AUTH
		auth: build.query<IAuthResponse, {}>({
			query: () => ({
				url: `${baseUrl}/auth`,
				method: 'GET',
			}),
		}),

		login: build.mutation<ILoginResponse, { email: string; password: string }>({
			query: items => ({
				url: `${serverIp}auth/email/login`,
				// url: 'http://localhost:3000/auth/email/login',
				method: 'POST',
				body: {
					email: items.email,
					password: items.password,
				},
			}),
		}),

		signup: build.mutation<
			ISignUpResponse,
			{ email: string; username: string; password: string }
		>({
			query: ({ email, password, username }) => ({
				url: `${serverIp}auth/email/register`,
				method: 'POST',
				body: {
					email: email,
					username: username,
					password: password,
				},
			}),
		}),

		changePassword: build.mutation<
			ISignUpResponse,
			{ password: string; newPassword: string }
		>({
			query: ({ password, newPassword }) => ({
				url: `${serverIp}user/changePassword`,
				method: 'POST',
				body: {
					password: password,
					newPassword: newPassword,
				},
			}),
		}),

		changeEmail: build.mutation<ISignUpResponse, { newEmail: string }>({
			query: ({ newEmail }) => ({
				url: `${serverIp}user/newEmail`,
				method: 'POST',
				body: {
					newEmail: newEmail,
				},
			}),
		}),

		changeUsername: build.mutation<ISignUpResponse, { newUsername: string }>({
			query: ({ newUsername }) => ({
				url: `${serverIp}user/newUsername`,
				method: 'POST',
				body: {
					newUsername: newUsername,
				},
			}),
		}),
	}),
})

export const {
	useSignupMutation,
	useLoginMutation,
	useAuthQuery,
	useChangeEmailMutation,
	useChangePasswordMutation,
	useChangeUsernameMutation,
} = userApi
export const userApiActions = userApi.internalActions
