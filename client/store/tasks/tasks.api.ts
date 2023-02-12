import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../'

import { ITaskResponse, IAllTasksResponse } from './tasks.types'

const serverIp = process.env.SERVER_IP
const baseUrl = serverIp + 'tasks/'

export const tasksApi = createApi({
	reducerPath: 'tasksApi',
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
		createTask: builder.mutation<
			ITaskResponse,
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
		readAllTasks: builder.mutation<IAllTasksResponse, {}>({
			query: () => ({
				url: `${baseUrl}/listsbyusertoken`,
				method: 'GET',
			}),
		}),
		readTask: builder.mutation<ITaskResponse, { taskId: string }>({
			query: ({ taskId }) => ({
				url: `${baseUrl}/list`,
				method: 'GET',
				params: { taskId: taskId },
			}),
		}),

		updateTask: builder.mutation<
			ITaskResponse,
			{ listId: string; title: string }
		>({
			query: ({ listId, title }) => ({
				url: `${baseUrl}/updatelist`,
				method: 'PUT',
				body: { listId: listId, title: title },
			}),
		}),
		deleteTask: builder.mutation<IAllTasksResponse, { taskId: string }>({
			query: ({ taskId }) => ({
				url: `${baseUrl}/deletelist`,
				method: 'PUT',
				body: { taskId: taskId },
			}),
		}),
	}),
})

export const {
	useCreateTaskMutation,
	useReadAllTasksMutation,
	useReadTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
} = tasksApi
