import { Document, ObjectId } from 'mongoose'
import { Photo } from 'common/interfaces/photo.interface'

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
	settings: {}
	contacts: string[]
	tasks: string[]
	// photos: {
	//   profilePic: Photo;
	//   gallery: Photo[];
	// }
}
