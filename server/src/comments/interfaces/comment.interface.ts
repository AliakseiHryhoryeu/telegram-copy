import { Document } from 'mongoose'

export interface Task extends Document {
	_id: string
	text: string
	date: Date
	checked: boolean
	commentsid: string[] //commentsid
}

export default Task
