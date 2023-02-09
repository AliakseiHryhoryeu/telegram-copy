import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import uuid from 'react-uuid'

import type { RootState } from '../'
import { userApi } from '../user/user.api'
import { tasksApi } from './tasks.api'
// import { taskSlice } from '../task/task.slice'
import { userSlice } from '../user/user.slice'

import { ITasksState, ITask } from './tasks.types'

// const LocalStorage_allLists = JSON.parse(localStorage.getItem('allLists'))
const emptyTasks: ITask[] = []

const initialState: ITasksState = {
	Tasks: emptyTasks,
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
		updateLocalList: (
			state,
			action: PayloadAction<{ listId: string; title: string }>
		) => {
			// state.allLists.find(list => list._id === action.payload.listId).title =
			// 	action.payload.title
			// localStorage.setItem('allLists', JSON.stringify(state.allLists))
		},
	},

	// Auto update our folders state
	extraReducers: builder => {
		// ================= //
		// === Lists Api === //
		// ================= //

		// необходить пройтись по данным получаемым с сервера
		builder.addMatcher(
			tasksApi.endpoints.createTask.matchFulfilled,
			(state, { payload }) => {
				if (payload.task) {
					state.Tasks.push(payload.task)
				}
			}
		),
			builder.addMatcher(
				tasksApi.endpoints.readTasksByToken.matchFulfilled,
				(state, { payload }) => {
					if (payload.tasks) {
						state.Tasks = payload.tasks
					}
				}
			),
			builder.addMatcher(
				tasksApi.endpoints.authReadTasksByToken.matchFulfilled,
				(state, { payload }) => {
					if (payload.tasks) {
						state.Tasks = payload.tasks
					}
				}
			),
			builder.addMatcher(
				tasksApi.endpoints.readTask.matchFulfilled,
				(state, { payload }) => {
					if (payload.task) {
						state.Tasks.filter(item => item._id === payload.task._id).map(
							item => {
								// item.tasksId = payload.list.tasksId
								// item.title = payload.list.title
							}
						)
					}
				}
			),
			builder.addMatcher(
				tasksApi.endpoints.updateTask.matchFulfilled,
				(state, { payload }) => {
					if (payload.task) {
						state.Tasks.filter(item => item._id === payload.task._id).map(
							item => {
								item.tasksId = payload.task.tasksId
								item.title = payload.task.title
							}
						)
					}
				}
			)

		// delete task
		// builder.addMatcher(
		// 	tasksApi.endpoints.deleteList.matchFulfilled,
		// 	(state, { payload }) => {
		// 		if (payload.lists) {
		// 			state.activeListId = ''
		// 			state.showTasks = true
		// 			state.allLists = payload.lists
		// 		}
		// 	}
		// )
		// // ================ //
		// // === User Api === //
		// // ================ //
		// builder.addMatcher(
		// 	userApi.endpoints.login.matchFulfilled,
		// 	(state, { payload }) => {
		// 		state.allLists = payload.lists
		// 	}
		// ),
		// builder.addMatcher(
		// 	userApi.endpoints.auth.matchFulfilled,
		// 	(state, { payload }) => {
		// 		state.allLists = payload.lists
		// 	}
		// ),
		// builder.addMatcher(
		// 	userSlice.actions.logout.match,
		// 	(state, { payload }) => {
		// 		state.allLists = initialState.allLists
		// 	}
		// ),
	},
})

export default listSlice.reducer

export const listReducer = listSlice.reducer
export const listActions = listSlice.actions

export const selectCurrentList = (state: RootState) => state.user.activeUser
