export class TaskDto {
	constructor(object: any) {
		this.title = object.title
		this.text = object.text
		this.username = object.username
		this.checked = object.checked
		this.date = object.date
	}
	readonly title: string
	readonly text: string
	readonly username: string
	readonly checked: boolean
	readonly date: Date
}

export class AllTasksDto {
	constructor(object: any) {
		this.tasks = object.tasks
	}
	readonly tasks: TaskDto[]
}
