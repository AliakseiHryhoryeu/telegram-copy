export class CommentDto {
	constructor(object: any) {
		this._id = object._id
		this.title = object.title
		this.text = object.text
		this.checked = object.checked
		this.date = object.date
		this.userid = object.userid
		this.commentsid = object.commentsid
	}
	readonly _id: string
	readonly title: string
	readonly text: string
	readonly checked: boolean
	readonly date: Date
	readonly userid: string
	readonly commentsid: string[]
}

export class AllCommentsDto {
	constructor(object: any) {
		this.tasks = object
	}
	readonly tasks: CommentDto[]
}
