export class UpdateTaskDto {
	readonly taskid: string
	readonly title?: string
	readonly text?: string
	readonly checked?: boolean
}
