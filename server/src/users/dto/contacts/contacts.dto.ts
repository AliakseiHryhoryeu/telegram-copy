export class ContactsDto {
	constructor(object: any) {
		this.contacts = object.contacts
	}
	contacts: {
		pending: string[] // req to user
		requests: string[] // user requests
		added: string[] // friends
	}
}
