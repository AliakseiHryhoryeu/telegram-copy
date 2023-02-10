export interface ITask {
	_id: string
	title: string
	text: string
	username: string
	checked: boolean
}
export interface ITasksState {
	Tasks: ITask[]
	// showAllLists: boolean
	// colors: string[]
}

// later
export interface IComment {
	_id: string
	text: string
	username: string
	date: Date
}
