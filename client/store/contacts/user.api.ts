import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '..'
import { IContacts, IUserAuthResponse, IUserResponse } from './user.types'

const serverIp = process.env.NEXT_PUBLIC_SERVER_IP
const baseUrl = serverIp + 'api/user'

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
		auth: build.query<IUserAuthResponse, {}>({
			query: () => ({
				url: `${baseUrl}/auth/jwt`,
				method: 'GET',
			}),
		}),

		login: build.mutation<
			IUserAuthResponse,
			{ email: string; password: string }
		>({
			query: items => ({
				url: `${serverIp}auth/email/login`,
				method: 'POST',
				body: {
					email: items.email,
					password: items.password,
				},
			}),
		}),

		signup: build.mutation<
			IUserAuthResponse,
			{ email: string; username: string; password: string }
		>({
			query: ({ email, password, username }) => ({
				url: `${serverIp}user/email/register`,
				method: 'POST',
				body: {
					email: email,
					username: username,
					password: password,
				},
			}),
		}),

		changePassword: build.mutation<
			IUserResponse,
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

		changeEmail: build.mutation<
			IUserResponse,
			{ password: string; newEmail: string }
		>({
			query: ({ newEmail }) => ({
				url: `${serverIp}user/changeEmail`,
				method: 'POST',
				body: {
					newEmail: newEmail,
				},
			}),
		}),

		changeUsername: build.mutation<
			IUserResponse,
			{ password: string; newUsername: string }
		>({
			query: ({ newUsername }) => ({
				url: `${serverIp}user/changeUsername`,
				method: 'POST',
				body: {
					newUsername: newUsername,
				},
			}),
		}),

		// ======== //
		// Contacts //
		// ======== //
		contactRequest: build.mutation<
			IContacts,
			{ password: string; newUsername: string }
		>({
			query: ({ newUsername }) => ({
				url: `${serverIp}user/contacts/request`,
				method: 'POST',
				body: {
					newUsername: newUsername,
				},
			}),
		}),
		contactAccept: build.mutation<
			IContacts,
			{ password: string; newUsername: string }
		>({
			query: ({ newUsername }) => ({
				url: `${serverIp}user/contacts/accept`,
				method: 'POST',
				body: {
					newUsername: newUsername,
				},
			}),
		}),
		contactReject: build.mutation<
			IContacts,
			{ password: string; newUsername: string }
		>({
			query: ({ newUsername }) => ({
				url: `${serverIp}user/contacts/reject`,
				method: 'POST',
				body: {
					newUsername: newUsername,
				},
			}),
		}),
		contactDelete: build.mutation<
			IContacts,
			{ password: string; newUsername: string }
		>({
			query: ({ newUsername }) => ({
				url: `${serverIp}user/contacts/delete`,
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
	useContactAcceptMutation,
	useContactDeleteMutation,
	useContactRejectMutation,
	useContactRequestMutation,
} = userApi
export const userApiActions = userApi.internalActions
