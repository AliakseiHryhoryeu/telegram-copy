import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '..'

import { ITaskResponse, IAllTasksResponse } from './contacts.types'

const serverIp = process.env.SERVER_IP

export const taskApi = createApi({
	reducerPath: 'taskApi',
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
	endpoints: builder => ({
		createTask: builder.mutation<
			ITaskResponse,
			{ title: string; text: string }
		>({
			query: ({ title, text }) => ({
				url: `${serverIp}tasks/create`,
				method: 'POST',
				body: {
					title: title,
					text: text,
				},
			}),
		}),
		readAllTasks: builder.mutation<IAllTasksResponse, {}>({
			query: () => ({
				url: `${serverIp}tasks/readAll`,
				method: 'GET',
			}),
		}),
		readTask: builder.mutation<ITaskResponse, { taskId: string }>({
			query: ({ taskId }) => ({
				url: `${serverIp}tasks/read`,
				method: 'GET',
				params: { taskId: taskId },
			}),
		}),

		updateTask: builder.mutation<
			ITaskResponse,
			{ taskid: string; title?: string; text?: string; checked?: boolean }
		>({
			query: ({ taskid, title, text, checked }) => ({
				url: `${serverIp}tasks/update`,
				method: 'POST',
				body: { taskid: taskid, title: title, text: text, checked: checked },
			}),
		}),
		deleteTask: builder.mutation<IAllTasksResponse, { taskId: string }>({
			query: ({ taskId }) => ({
				url: `${serverIp}tasks/delete`,
				method: 'DELETE',
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
} = taskApi
