import { Document } from 'mongoose'
// import { Photo } from 'common/interfaces/photo.interface'

export interface User extends Document {
	username: string
	email: string
	password: string
	roles: string[]
	auth: {
		email: {
			valid: boolean
		}
		facebook: {
			userid: string
		}
		gmail: {
			userid: string
		}
	}
	contacts: {
		pending: string[] // req to user
		requests: string[] // user requests
		added: string[] // friends
	}
	tasks: string[]
	// photos: {
	//   profilePic: Photo;
	//   gallery: Photo[];
	// }
}
