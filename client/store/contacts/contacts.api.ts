import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '..'

import { IContacts } from './contacts.types'

const serverIp = process.env.SERVER_IP
const baseUrl = serverIp + 'contacts/'

export interface ContactsResponse {
	contacts: IContacts[]
}

// export interface TaskResponse {
// 	task: IContacts
// }

export const contactsApi = createApi({
	reducerPath: 'contactsApi',
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
	endpoints: builder => ({
		acceptContact: builder.mutation<
			ContactsResponse,
			{ title: string; text: string }
		>({
			query: ({ title, text }) => ({
				url: `${baseUrl}/createTask`,
				method: 'POST',
				body: {
					title: title,
					text: text,
				},
			}),
		}),
		rejectContact: builder.mutation<
			ContactsResponse,
			{ title: string; text: string }
		>({
			query: ({ title, text }) => ({
				url: `${baseUrl}/createTask`,
				method: 'POST',
				body: {
					title: title,
					text: text,
				},
			}),
		}),
		readContactsByToken: builder.mutation<ContactsResponse, {}>({
			query: () => ({
				url: `${baseUrl}/listsbyusertoken`,
				method: 'GET',
			}),
		}),

		readContact: builder.mutation<ContactsResponse, { contactId: string }>({
			query: ({ contactId }) => ({
				url: `${baseUrl}/list`,
				method: 'GET',
				params: { contactId: contactId },
			}),
		}),

		deleteContact: builder.mutation<ContactsResponse, { contactId: string }>({
			query: ({ contactId }) => ({
				url: `${baseUrl}/deletelist`,
				method: 'PUT',
				body: { contactId: contactId },
			}),
		}),
	}),
})

export const {
	useReadContactMutation,
	useAcceptContactMutation,
	useDeleteContactMutation,
	useReadContactsByTokenMutation,
	useRejectContactMutation,
} = contactsApi
