import { ITask } from '../tasks/tasks.types'

export interface IUserState {
	activeUser: IUser
	token: string
	isAuth: boolean
}

export interface IUser {
	username: string
	email: string
	tasks: ITask[]
	contacts: IContacts
}

export interface IToken {
	expires_in: string
	access_token: string // access_token contain email
}

export interface IUserAuthResponse {
	success: boolean
	message: string
	data: {
		token: IToken
		user: {
			username: string
			email: string
			contacts: IContacts
			tasks: ITask[]
		}
	}
}

export interface IUserResponse {
	success: boolean
	message: string
	data: {
		user: {
			username: string
			email: string
			contacts: IContacts
			tasks: ITask[]
		}
	}
}

export interface IContacts {
	pending: IContact[]
	requests: IContact[]
	added: IContact[]
}

export interface IContact {
	_id: string
	username: string
}

export interface IContactsResponse {
	success: boolean
	message: string
	data: {
		contacts: IContacts
	}
}

export const emptyState = {
	activeUser: {
		username: '',
		email: '',
		tasks: [],
		contacts: {
			pending: [],
			requests: [],
			added: [],
		},
	},
	token: '',
	isAuth: false,
}
