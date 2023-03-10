import { Document } from 'mongoose'

export interface Task extends Document {
	_id: string
	title: string
	text: string
	username: string
	userid: string
	date: Date
	checked: boolean
	commentsid: string[] //commentsid
}

export default Task
