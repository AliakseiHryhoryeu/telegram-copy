export interface IUser {
	email: string
	username: string
}

export type IUserState = {
	activeUser: IUser
	token: string
	isAuth: boolean
}

export type IUserResponse = {
	success: boolean
	message: string
	data: {
		token: {
			expires_in: string
			access_token: string // access_token contain email
		}
		user: {
			email: string
			contacts: {
				pending: string[]
				requests: string[]
				added: string[]
			}
			tasks: string[]
		}
	}
}
