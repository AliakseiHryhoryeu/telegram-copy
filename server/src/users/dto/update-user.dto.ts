import { UserDto } from './user.dto'

interface IToken {
	expires_in: number
	access_token: any
}

export class UserUpdateDto {
	constructor(object: any) {
		this.token = object.token
		this.user = object.user
	}
	readonly token: IToken
	readonly user: UserDto
}
