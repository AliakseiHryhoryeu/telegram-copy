export class SearchContactDto {
	readonly username: string
}

export interface IContact {
	_id: string
	username: string
}

export class IContactDto {
	constructor(object: any) {
		this._id = object._id
		this.username = object.username
	}
	readonly _id: string
	readonly username: string
}
