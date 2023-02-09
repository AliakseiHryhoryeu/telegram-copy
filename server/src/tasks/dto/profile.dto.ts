export class ProfileDto {
	constructor(object: any) {
		this.email = object.email
		this.username = object.username
	}
	readonly email: string
	readonly username: string
}
