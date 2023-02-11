export class UserDto {
	constructor(object: any) {
		this.username = object.username
		this.email = object.email
		this.tasks = object.tasks
		this.contacts = object.contacts
	}
	readonly username: string
	readonly email: string
	tasks: string[]
	contacts: {
		pending: string[] // req to user
		requests: string[] // user requests
		added: string[] // friends
	}
}
