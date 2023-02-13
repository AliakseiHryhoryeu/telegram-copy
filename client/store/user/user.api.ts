import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../'
import {
	IContacts,
	IContactsResponse,
	IUserAuthResponse,
	IUserResponse,
} from './user.types'

const serverIp = process.env.NEXT_PUBLIC_SERVER_IP
// const baseUrl = serverIp + 'api/user'

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: serverIp,
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
		auth: build.mutation<IUserAuthResponse, {}>({
			query: () => ({
				url: `${serverIp}auth/jwt`,
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
			query: ({ password, newEmail }) => ({
				url: `${serverIp}users/changeEmail`,
				method: 'POST',
				body: {
					password: password,
					newEmail: newEmail,
				},
			}),
		}),

		changeUsername: build.mutation<
			IUserResponse,
			{ password: string; newUsername: string }
		>({
			query: ({ password, newUsername }) => ({
				url: `${serverIp}user/changeUsername`,
				method: 'POST',
				body: {
					password: password,
					newUsername: newUsername,
				},
			}),
		}),

		// ======== //
		// Contacts //
		// ======== //
		contactRequest: build.mutation<IContactsResponse, { contactid: string }>({
			query: ({ contactid }) => ({
				url: `${serverIp}users/contacts/request`,
				method: 'POST',
				body: {
					contactid: contactid,
				},
			}),
		}),
		contactAccept: build.mutation<IContactsResponse, { contactid: string }>({
			query: ({ contactid }) => ({
				url: `${serverIp}users/contacts/accept`,
				method: 'POST',
				body: {
					contactid: contactid,
				},
			}),
		}),
		contactReject: build.mutation<IContactsResponse, { contactid: string }>({
			query: ({ contactid }) => ({
				url: `${serverIp}users/contacts/reject`,
				method: 'POST',
				body: {
					contactid: contactid,
				},
			}),
		}),
		contactDelete: build.mutation<IContactsResponse, { contactid: string }>({
			query: ({ contactid }) => ({
				url: `${serverIp}users/contacts/delete`,
				method: 'POST',
				body: {
					contactid: contactid,
				},
			}),
		}),
	}),
})

export const {
	useSignupMutation,
	useLoginMutation,
	useAuthMutation,
	useChangeEmailMutation,
	useChangePasswordMutation,
	useChangeUsernameMutation,
	useContactAcceptMutation,
	useContactDeleteMutation,
	useContactRejectMutation,
	useContactRequestMutation,
} = userApi
export const userApiActions = userApi.internalActions
