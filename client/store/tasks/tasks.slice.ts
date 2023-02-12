import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import uuid from 'react-uuid'

import type { RootState } from '../'
import { userApi } from '../user/user.api'
import { tasksApi } from './tasks.api'
// import { taskSlice } from '../task/task.slice'
import { userSlice } from '../user/user.slice'

import { ITasksState, ITask } from './tasks.types'

// const LocalStorage_allLists = JSON.parse(localStorage.getItem('allLists'))

const initialState: ITasksState = {
	tasks: [],
}

const example = [
	{
		_id: 'tguhjirftg',
		title: 'test title',
		color: 'blue',
		tasksId: [''],
		userId: '',
	},
]

export const listSlice = createSlice({
	name: 'listSlice',
	initialState,
	reducers: {
		// updateLocalList: (
		// 	state,
		// 	action: PayloadAction<{ listId: string; title: string }>
		// ) => {
		// 	// state.allLists.find(list => list._id === action.payload.listId).title =
		// 	// 	action.payload.title
		// 	// localStorage.setItem('allLists', JSON.stringify(state.allLists))
		// },
	},

	extraReducers: builder => {
		// READ ALL TASKS
		builder.addMatcher(
			tasksApi.endpoints.readAllTasks.matchFulfilled,
			(state, { payload }) => {
				if (payload.tasks) {
					state.tasks = payload.tasks
				}
			}
		),
			builder.addMatcher(
				tasksApi.endpoints.readTask.matchFulfilled,
				(state, { payload }) => {
					if (payload) {
						state.tasks.push(payload)
					}
				}
			),
			builder.addMatcher(
				// CREATE TASK
				tasksApi.endpoints.createTask.matchFulfilled,
				(state, { payload }) => {
					if (payload) {
						state.tasks.push(payload)
					}
				}
			),
			builder.addMatcher(
				tasksApi.endpoints.readTask.matchFulfilled,
				(state, { payload }) => {
					if (payload) {
						state.tasks
							.filter(item => item._id === payload._id)
							.map(item => {
								// item.tasksId = payload.list.tasksId
								// item.title = payload.list.title
							})
					}
				}
			),
			builder.addMatcher(
				tasksApi.endpoints.updateTask.matchFulfilled,
				(state, { payload }) => {
					if (payload) {
						state.tasks
							.filter(item => item._id === payload._id)
							.map(item => {
								// item.tasksId = payload.list.tasksId
								// item.title = payload.list.title
							})
					}
				}
			)
	},
})

export default listSlice.reducer

export const listReducer = listSlice.reducer
export const listActions = listSlice.actions

export const selectCurrentList = (state: RootState) => state.user.activeUser
