// import { SettingsDto } from './settings.dto'
// import { PhotoDto } from '../../common/dto/photo.dto'

export class TaskDto {
	constructor(object: any) {
		this.title = object.title
		this.text = object.text
		this.username = object.username
		this.userid = object.userid
		this.checked = object.checked
		this.date = object.date
	}
	readonly title: string
	readonly text: string
	readonly username: string
	readonly userid: string
	readonly checked: boolean
	readonly date: Date
}
