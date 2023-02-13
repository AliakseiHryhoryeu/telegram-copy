import * as mongoose from 'mongoose'

export const CommentSchema = new mongoose.Schema({
	id: String,
	taskid: String,
	userid: String,
	text: String,
	date: { type: Date, default: Date.now },
})
