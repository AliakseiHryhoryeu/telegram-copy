import { UsersService } from 'users/users.service'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

import { default as config } from '../config'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { JWTService } from './jwt.service'
import { Model } from 'mongoose'
import { User } from '../users/interfaces/user.interface'
import { UserDto } from '../users/dto/user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { HeaderDto } from './dto/header.dto'
import Task from '../tasks/interfaces/task.interface'
import {
	IContact,
	IContacts,
	UserResponse,
} from '../users/dto/contacts/contacts.dto'

const jwtSecretKey = config.jwt.secretOrKey

@Injectable()
export class AuthService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		@InjectModel('Task') private readonly taskModel: Model<Task>,
		private readonly jwtService: JWTService
	) {}

	async findByUserid(userid: string): Promise<User> {
		return await this.userModel.findOne({ _id: userid }).exec()
	}

	async findTasksByUserid(userid: string): Promise<Task[]> {
		return await this.taskModel.find({ userid: userid }).exec()
	}

	async getContacts(userid: string): Promise<IContacts> {
		const user = await this.findByUserid(userid)

		let pendingContacts: IContact[] = []
		for (let i = 0; i < user.contacts.pending.length; i++) {
			const contact = await this.findByUserid(String(user.contacts.pending[i]))
			const response = {
				_id: contact._id,
				username: contact.username,
			}
			pendingContacts.push(response)
		}

		let requestContacts: IContact[] = []
		for (let i = 0; i < user.contacts.requests.length; i++) {
			const contact = await this.findByUserid(String(user.contacts.requests[i]))
			const response = {
				_id: contact._id,
				username: contact.username,
			}
			requestContacts.push(response)
		}

		let addedContacts: IContact[] = []
		for (let i = 0; i < user.contacts.added.length; i++) {
			const contact = await this.findByUserid(String(user.contacts.added[i]))
			const response = {
				_id: contact._id,
				username: contact.username,
			}
			addedContacts.push(response)
		}

		const userContacts: IContacts = {
			pending: pendingContacts,
			requests: requestContacts,
			added: addedContacts,
		}
		return userContacts
	}

	async getResponseData(userid: string): Promise<UserResponse> {
		try {
			const user = await this.findByUserid(userid)
			const tasks = await this.findTasksByUserid(userid)
			const contacts = await this.getContacts(userid)
			return new UserResponse(user, contacts, tasks)
		} catch (e) {
			console.log(e)
		}
	}

	async validateJwt(headers: HeaderDto) {
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'CONTACTS.AUTHORIZED ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded = jwt.verify(token, jwtSecretKey)
		var userFromDb = await this.userModel.findOne({ _id: decoded._id })

		if (!userFromDb)
			throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.UNAUTHORIZED)

		var accessToken = await this.jwtService.createToken(
			userFromDb._id,
			userFromDb.roles
		)
		return {
			token: accessToken,
			user: await this.getResponseData(userFromDb._id),
		}
	}

	async validateLogin(email, password) {
		var userFromDb = await this.userModel.findOne({ email: email })
		if (!userFromDb)
			throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND)
		if (!userFromDb.auth.email.valid)
			throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN)

		var isValidPass = await bcrypt.compare(password, userFromDb.password)

		if (isValidPass) {
			var accessToken = await this.jwtService.createToken(
				userFromDb._id,
				userFromDb.roles
			)
			return {
				token: accessToken,
				user: await this.getResponseData(userFromDb._id),
			}
		} else {
			throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED)
		}
	}

	async checkPassword(email: string, password: string) {
		var userFromDb = await this.userModel.findOne({ email: email })
		if (!userFromDb)
			throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND)

		return await bcrypt.compare(password, userFromDb.password)
	}
}
