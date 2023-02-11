export class UserDto {
	constructor(object: any) {
		this.username = object.name
		this.email = object.email
		this.contacts = object.contacts
		this.tasks = object.tasks
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
