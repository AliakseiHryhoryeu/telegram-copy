import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'

import { JWTService } from '../auth/jwt.service'
import { User } from './interfaces/user.interface'
import { HeaderDto, IDecodedToken } from 'auth/dto/header.dto'
import { default as config } from '../config'
import { CreateUserDto } from './dto/create-user.dto'
import { ChangeUsernameDto } from './dto/change-username'
import { IContact, IContacts, UserResponse } from './dto/contacts/contacts.dto'
import { ChangeEmailDto } from './dto/change-email'
import { ChangePasswordDto } from './dto/change-password'
import { AcceptContactDto } from './dto/contacts/accept-contact'
import { RejectContactDto } from './dto/contacts/reject-contact'
import { RequestContactDto } from './dto/contacts/request-contact'
import { Task } from '../tasks/interfaces/task.interface'
import { IContactDto, SearchContactDto } from './dto/contacts/search-contact'

const saltRounds = 10
const jwtSecretKey = config.jwt.secretOrKey

@Injectable()
export class UsersService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		@InjectModel('Task') private readonly taskModel: Model<Task>,
		private readonly jwtService: JWTService
	) {}

	async findByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email: email }).exec()
	}
	async findByUsername(username: string): Promise<User> {
		return await this.userModel.findOne({ username: username }).exec()
	}

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

	async searchContact(
		searchContactDto: SearchContactDto,
		headers: HeaderDto
	): Promise<IContact> {
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'USER.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)
			const searchedContact = await this.userModel.findOne({
				username: searchContactDto.username,
			})
			return searchedContact
		} catch (e) {
			console.log(e)
		}
	}

	async createNewUser(newUser: CreateUserDto): Promise<User> {
		if (this.isValidEmail(newUser.email) && newUser.password) {
			const userRegistered = await this.findByEmail(newUser.email)
			const userUsername = await this.findByUsername(newUser.username)
			if (userUsername) {
				throw new HttpException(
					'REGISTRATION.USERNAME_ALREADY_REGISTERED',
					HttpStatus.FORBIDDEN
				)
			}
			if (!userRegistered && !userUsername) {
				newUser.password = await bcrypt.hash(newUser.password, saltRounds)
				const createdUser = new this.userModel(newUser)
				createdUser.roles = ['User']
				return await createdUser.save()
				// } else if (!userRegistered.auth.email.valid) {
			} else if (!userRegistered.auth.email.valid) {
				return userRegistered
			} else {
				throw new HttpException(
					'REGISTRATION.USER_ALREADY_REGISTERED',
					HttpStatus.FORBIDDEN
				)
			}
		} else {
			throw new HttpException(
				'REGISTRATION.MISSING_MANDATORY_PARAMETERS',
				HttpStatus.FORBIDDEN
			)
		}
	}

	// ======================== //
	// CHANGE USER PRIMARY DATA //
	// ======================== //

	async changeUsername(
		changeUsernameDto: ChangeUsernameDto,
		headers: HeaderDto
	): Promise<UserResponse> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException('USER.AUTHORIZED_ERROR', HttpStatus.UNAUTHORIZED)
		}
		const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)

		const usernameLenght = changeUsernameDto.newUsername.length
		if (usernameLenght < 4 || usernameLenght > 20) {
			throw new HttpException(
				'USER.CHANGE_USERNAME_WRONG_USERNAME_LENGHT',
				HttpStatus.BAD_REQUEST
			)
		}

		const userFromDb = await this.findByUserid(decoded._id)
		const isValidPass = await bcrypt.compare(
			changeUsernameDto.password,
			userFromDb.password
		)
		const isHaveUser = await this.findByUsername(changeUsernameDto.newUsername)
		if (isHaveUser) {
			throw new HttpException(
				'USER.USERNAME_ALREDY_EXSIST',
				HttpStatus.FORBIDDEN
			)
		}

		if (isValidPass) {
		} else {
			throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED)
		}

		userFromDb.username = changeUsernameDto.newUsername
		await userFromDb.save()
		return await this.getResponseData(decoded._id)
	}

	async changeEmail(
		changeEmailDto: ChangeEmailDto,
		headers: HeaderDto
	): Promise<UserResponse> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException('USER.AUTHORIZED_ERROR', HttpStatus.UNAUTHORIZED)
		}
		const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)

		const emailLenght = changeEmailDto.newEmail.length
		if (emailLenght < 4 || emailLenght > 40) {
			throw new HttpException(
				'USER.CHANGE_EMAIL_WRONG_EMAIL_LENGHT',
				HttpStatus.BAD_REQUEST
			)
		}

		const userFromDb = await this.findByUserid(decoded._id)
		const isValidPass = await bcrypt.compare(
			changeEmailDto.password,
			userFromDb.password
		)
		const isHaveUser = await this.findByEmail(changeEmailDto.newEmail)
		if (isHaveUser) {
			throw new HttpException('USER.EMAIL_ALREDY_EXSIST', HttpStatus.FORBIDDEN)
		}
		if (isValidPass) {
		} else {
			throw new HttpException(
				'USER.ERROR_CHANGE_EMAIL',
				HttpStatus.UNAUTHORIZED
			)
		}

		userFromDb.email = changeEmailDto.newEmail
		await userFromDb.save()
		return await this.getResponseData(decoded._id)
	}

	async changePassword(
		changePasswordDto: ChangePasswordDto,
		headers: HeaderDto
	): Promise<UserResponse> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException('USER.AUTHORIZED_ERROR', HttpStatus.UNAUTHORIZED)
		}
		const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)
		const passwordLenght = changePasswordDto.newPassword.length
		if (passwordLenght < 6 || passwordLenght > 20) {
			throw new HttpException(
				'USER.CHANGE_PASSWORD_WRONG_PASSWORD_LENGHT',
				HttpStatus.BAD_REQUEST
			)
		}
		const userFromDb = await this.findByUserid(decoded._id)
		const isValidPass = await bcrypt.compare(
			changePasswordDto.currentPassword,
			userFromDb.password
		)

		if (isValidPass) {
		} else {
			throw new HttpException(
				'USER.ERROR_CHANGE_EMAIL',
				HttpStatus.UNAUTHORIZED
			)
		}

		userFromDb.password = await bcrypt.hash(
			changePasswordDto.newPassword,
			saltRounds
		)

		await userFromDb.save()
		return await this.getResponseData(decoded._id)
	}

	// ======== //
	// CONTACTS //
	// ======== //

	async contactsInfo(headers: HeaderDto): Promise<IContacts> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'USER.CONTACTS_AUTHORIZED_ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)

		return await this.getContacts(decoded._id)
	}

	async contactRequest(
		requestContact: RequestContactDto,
		headers: HeaderDto
	): Promise<IContacts> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'USER.CONTACTS_AUTHORIZED_ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)

		const user = await this.findByUserid(decoded._id)
		const user2 = await this.findByUserid(requestContact.contactid)
		if (!user2) {
			throw new HttpException(
				'USER.CONTACTS_INCORRENT_USERNAME_REQUEST',
				HttpStatus.BAD_REQUEST
			)
		}

		//  request already send
		if (user.contacts.pending.find(item => String(item) == String(user2._id)))
			throw new HttpException(
				'USER.CONTACTS_REQUEST_ALREDY_SEND',
				HttpStatus.BAD_REQUEST
			)
		// already in friends
		if (user.contacts.added.find(item => String(item) == String(user2._id)))
			throw new HttpException(
				'USER.CONTACTS_REQUEST_ALREDY_SEND',
				HttpStatus.BAD_REQUEST
			)

		user.contacts.pending.push(user2._id)
		user2.contacts.requests.push(user._id)
		await user.save()
		await user2.save()

		return await this.getContacts(user._id)
	}

	async contactAccept(
		acceptContact: AcceptContactDto,
		headers: HeaderDto
	): Promise<IContacts> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'USER.CONTACTS_AUTHORIZED_ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)

		const user = await this.findByUserid(decoded._id)
		const user2 = await this.findByUserid(acceptContact.contactid)
		if (!user2) {
			throw new HttpException('USER.CONTACTS_ERROR', HttpStatus.BAD_REQUEST)
		}
		if (!user.contacts.requests.find(item => String(item) == String(user2._id)))
			throw new HttpException('USER.CONTACTS_ERROR', HttpStatus.OK)

		// delete from pending and requests contacts array
		await this.userModel.updateMany(
			{ _id: user._id },
			{ $pull: { 'contacts.pending': user2._id } }
		)
		await this.userModel.updateMany(
			{ _id: user2._id },
			{ $pull: { 'contacts.requests': user._id } }
		)

		// if alredy in friends not will be added again
		if (
			user.contacts.added.find(item => String(item) == String(user2._id)) ==
			undefined
		)
			user.contacts.added.push(user2._id)

		// if alredy in friends not will be added again
		if (
			user2.contacts.added.find(item => String(item) == String(user2._id)) ==
			undefined
		)
			user2.contacts.added.push(user._id)

		await user.save()
		await user2.save()

		// return user.contacts
		return await this.getContacts(user._id)
	}

	async contactReject(
		rejectContact: RejectContactDto,
		headers: HeaderDto
	): Promise<IContacts> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'CONTACTS.AUTHORIZED ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)

		const user = await this.findByUserid(decoded._id)
		const user2 = await this.findByUserid(rejectContact.contactid)
		if (user2 == undefined) {
			throw new HttpException(
				'INCORRENT USERNAME REQUEST',
				HttpStatus.BAD_REQUEST
			)
		}

		await this.userModel.updateMany(
			{ _id: user._id },
			{ $pull: { 'contacts.requests': user2._id } }
		)
		await this.userModel.updateMany(
			{ _id: user2._id },
			{ $pull: { 'contacts.pending': user._id } }
		)

		await user.save()
		await user2.save()

		return await this.getContacts(user._id)
	}

	async contactDelete(
		contactDto: AcceptContactDto,
		headers: HeaderDto
	): Promise<IContacts> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'CONTACTS.AUTHORIZED ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)

		const user = await this.findByUserid(decoded._id)
		const user2 = await this.findByUserid(contactDto.contactid)
		if (user2 == undefined) {
			throw new HttpException(
				'INCORRENT USERNAME REQUEST',
				HttpStatus.BAD_REQUEST
			)
		}
		await this.userModel.updateMany(
			{ _id: user._id },
			{ $pull: { 'contacts.added': user2._id } }
		)
		await this.userModel.updateMany(
			{ _id: user2._id },
			{ $pull: { 'contacts.added': user._id } }
		)

		await user.save()
		await user2.save()

		return await this.getContacts(user._id)
	}

	isValidEmail(email: string) {
		if (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			return re.test(email)
		} else return false
	}

	// update password
	async setPassword(email: string, newPassword: string): Promise<boolean> {
		var userFromDb = await this.userModel.findOne({ email: email })
		if (!userFromDb)
			throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND)

		userFromDb.password = await bcrypt.hash(newPassword, saltRounds)

		await userFromDb.save()
		return true
	}
}
