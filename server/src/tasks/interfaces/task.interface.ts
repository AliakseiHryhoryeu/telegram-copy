import { Document } from 'mongoose'
import { Photo } from 'common/interfaces/photo.interface'

export interface Task extends Document {
	title: string
	text: string
	username: string
	userid: string
	date: Date
	checked: boolean
	// comments: string[] //commentsid
}
