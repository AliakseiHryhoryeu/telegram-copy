import { User } from 'users/interfaces/user.interface'
import ITask from '../../../tasks/interfaces/task.interface'

export class UserResponse {
	constructor(user: User, contacts: IContacts, tasks: ITask[]) {
		this._id = user._id
		this.username = user.username
		this.email = user.email
		this.tasks = tasks
		this.contacts = contacts
	}
	readonly _id: string
	readonly username: string
	readonly email: string
	tasks: ITask[]
	contacts: IContacts
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
