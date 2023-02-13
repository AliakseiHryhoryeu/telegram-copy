export class UserDto {
	constructor(object: any) {
		this._id = object._id
		this.username = object.username
		this.email = object.email
		this.tasks = object.tasks
		this.contacts = object.contacts
	}
	readonly _id: string
	readonly username: string
	readonly email: string
	tasks: string[]
	contacts: {
		pending: string[]
		requests: string[]
		added: string[]
	}
}
