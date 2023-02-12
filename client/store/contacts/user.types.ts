import { ITask } from '../tasks/tasks.types'

export interface ICommentsState {
	comments: IComment[]
}

// later
export interface IComment {
	_id: string
	text: string
	username: string
	date: Date
}
