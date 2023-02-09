import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import uuid from 'react-uuid'

import type { RootState } from '..'
import { userApi } from '../user/user.api'
import { contactsApi } from './contacts.api'
// import { taskSlice } from '../task/task.slice'
import { userSlice } from '../user/user.slice'

import { IContactsState, IContacts } from './contacts.types'

// const LocalStorage_allLists = JSON.parse(localStorage.getItem('allLists'))
const emptyTasks: IContacts[] = []

const initialState: IContactsState = {
	contacts: [],
	requests: [],
	searchContacts: [],
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

export const contactsSlice = createSlice({
	name: 'contactsSlice',
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
			contactsApi.endpoints.acceptContact.matchFulfilled,
			(state, { payload }) => {
				if (payload.contacts) {
					// state.contacts.push(payload.contacts)
				}
			}
		),
			builder.addMatcher(
				contactsApi.endpoints.rejectContact.matchFulfilled,
				(state, { payload }) => {
					if (payload.contacts) {
						state.contacts = payload.contacts
					}
				}
			),
			builder.addMatcher(
				contactsApi.endpoints.readContact.matchFulfilled,
				(state, { payload }) => {
					if (payload.contacts) {
						state.contacts = payload.contacts
					}
				}
			),
			builder.addMatcher(
				contactsApi.endpoints.readContactsByToken.matchFulfilled,
				(state, { payload }) => {
					if (payload.contacts) {
						state.contacts
						// .filter(item => item._id === payload.contacts)
						// .map(item => {
						// 	// item.contactsId = payload.list.contactsId
						// 	// item.title = payload.list.title
						// })
					}
				}
			),
			builder.addMatcher(
				contactsApi.endpoints.deleteContact.matchFulfilled,
				(state, { payload }) => {
					if (payload.contacts) {
						state.contacts
						// .filter(item => item._id === payload.task._id)
						// .map(item => {
						// 	// item.contactsId = payload.task.tasksId
						// 	// item.title = payload.task.title
						// })
					}
				}
			)

		// delete task
		// builder.addMatcher(
		// 	contactsApi.endpoints.deleteList.matchFulfilled,
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

export default contactsSlice.reducer

export const listReducer = contactsSlice.reducer
export const listActions = contactsSlice.actions

export const selectCurrentList = (state: RootState) => state.user.activeUser
