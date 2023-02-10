import * as mongoose from 'mongoose'

export const TaskSchema = new mongoose.Schema({
	id: String,
	title: String,
	text: String,
	username: String,
	userid: String,
	checked: { type: Boolean, default: false },
	// comments: [],
	date: { type: Date, default: Date.now },
})
