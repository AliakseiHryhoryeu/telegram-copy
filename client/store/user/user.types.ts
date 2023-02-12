import { ITask } from '../tasks/tasks.types'

export interface IUserState {
	activeUser: IUser
	token: string
	isAuth: boolean
}

export interface IUser {
	username: string
	email: string
	tasks: string[]
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
			tasks: string[]
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
			tasks: string[]
		}
	}
}

export interface IContacts {
	pending: IContactNotAdded[]
	requests: IContactNotAdded[]
	added: IContact[]
}

export interface IContactNotAdded {
	_id: string
	username: string
}

export interface IContact {
	_id: string
	username: string
	tasks: ITask[]
}

export interface IContactsResponse {
	success: boolean
	message: string
	data: {
		contacts: IContacts
	}
}
