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
	// tasks: ITask[]
}

export interface IContactsResponse {
	success: boolean
	message: string
	data: {
		contacts: IContacts
	}
}
