export interface IUser {
	id: string
	email: string
	username: string
}

export type IUserState = {
	activeUser: IUser
	token: string
	isAuth: boolean
}
