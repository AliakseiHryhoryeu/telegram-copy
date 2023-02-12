import * as mongoose from 'mongoose'

export const TaskSchema = new mongoose.Schema({
	id: String,
	title: String,
	text: String,
	checked: { type: Boolean, default: false },
	date: { type: Date, default: Date.now },
	userid: String,
	commentsid: Array,
})
