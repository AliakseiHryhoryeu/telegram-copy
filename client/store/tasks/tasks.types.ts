export interface ITasksState {
	tasks: ITask[]
}

export interface ITask {
	_id: string
	title: string
	text: string
	checked: boolean
	date: Date
	userid: string
	commentsid: string[]
}

export interface ITaskResponse {
	data: {
		success: boolean
		message: string
		data: ITask
	}
}

export interface IAllTasksResponse {
	data: {
		success: boolean
		message: string
		data: ITask[]
	}
}
