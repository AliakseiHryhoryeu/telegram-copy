import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../'

import { ITask } from './tasks.types'

const serverIp = process.env.SERVER_IP
const baseUrl = serverIp + 'tasks/'

export interface allTasksResponse {
	tasks: ITask[]
}

export interface TaskResponse {
	task: ITask
}

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
		createTask: builder.mutation<TaskResponse, { title: string; text: string }>(
			{
				query: ({ title, text }) => ({
					url: `${baseUrl}/createTask`,
					method: 'POST',
					body: {
						title: title,
						text: text,
					},
				}),
			}
		),
		readTasksByToken: builder.mutation<allTasksResponse, {}>({
			query: () => ({
				url: `${baseUrl}/listsbyusertoken`,
				method: 'GET',
			}),
		}),

		// maybe delete when refactor code
		authReadTasksByToken: builder.query<allTasksResponse, {}>({
			query: () => ({
				url: `${baseUrl}/listsbyusertoken`,
				method: 'GET',
			}),
		}),

		readTask: builder.mutation<TaskResponse, { taskId: string }>({
			query: ({ taskId }) => ({
				url: `${baseUrl}/list`,
				method: 'GET',
				params: { taskId: taskId },
			}),
		}),
		updateTask: builder.mutation<
			TaskResponse,
			{ listId: string; title: string }
		>({
			query: ({ listId, title }) => ({
				url: `${baseUrl}/updatelist`,
				method: 'PUT',
				body: { listId: listId, title: title },
			}),
		}),
		deleteTask: builder.mutation<allTasksResponse, { taskId: string }>({
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
	useReadTaskMutation,
	useReadTasksByTokenMutation,
	useAuthReadTasksByTokenQuery,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
} = tasksApi
