import { ITask } from '../tasks/tasks.types'

export interface IContacts {
	_id: string
	username: string
	tasks: ITask[]
	tasksId: string[]
}

export interface IContactRequest {
	// _id: string
	username: string
}
export interface IContactsState {
	contacts: IContacts[]
	requests: IContactRequest[]
	searchContacts: IContactRequest[]
	// showAllLists: boolean
	// colors: string[]
}
