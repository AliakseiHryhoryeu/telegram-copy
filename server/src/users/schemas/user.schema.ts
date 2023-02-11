import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
	id: String,
	date: { type: Date, default: Date.now },
	username: String,
	email: String,
	password: String,
	roles: [],
	auth: {
		email: {
			valid: { type: Boolean, default: true },
		},
		facebook: {
			userid: String,
		},
		gmail: {
			userid: String,
		},
	},
	contacts: {
		pending: [], // req to user
		requests: [], // user requests
		added: [], // friends
	},
	tasks: [],
})
