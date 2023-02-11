import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'

import { JWTService } from '../auth/jwt.service'
import { User } from './interfaces/user.interface'
import { HeaderDto } from 'auth/dto/header.dto'
import { default as config } from '../config'
import { CreateUserDto } from './dto/create-user.dto'
import { ChangeUsernameDto } from './dto/change-username'
import { UserUpdateDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { ChangeEmailDto } from './dto/change-email'
import { ChangePasswordDto } from './dto/change-password'
import { AcceptContactDto } from './dto/contacts/accept-contact'
import { RejectContactDto } from './dto/contacts/reject-contact'
import { RequestContactDto } from './dto/contacts/request-contact'

const saltRounds = 10
const jwtSecretKey = config.jwt.secretOrKey

@Injectable()
export class UsersService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		private readonly jwtService: JWTService
	) {}

	async findAll(): Promise<User[]> {
		return await this.userModel.find().exec()
	}

	async findByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email: email }).exec()
	}
	async findByUsername(username: string): Promise<User> {
		return await this.userModel.findOne({ username: username }).exec()
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
	): Promise<UserUpdateDto> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException('USER.AUTHORIZED_ERROR', HttpStatus.UNAUTHORIZED)
		}
		const decoded = jwt.verify(token, jwtSecretKey)

		const userFromDb = await this.findByEmail(decoded.email)
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
			var accessToken = await this.jwtService.createToken(
				userFromDb.email,
				userFromDb.roles
			)
		} else {
			throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED)
		}

		userFromDb.username = changeUsernameDto.newUsername
		await userFromDb.save()
		return { token: accessToken, user: new UserDto(userFromDb) }
	}

	async changeEmail(
		changeEmailDto: ChangeEmailDto,
		headers: HeaderDto
	): Promise<UserUpdateDto> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException('USER.AUTHORIZED_ERROR', HttpStatus.UNAUTHORIZED)
		}
		const decoded = jwt.verify(token, jwtSecretKey)

		const userFromDb = await this.findByEmail(decoded.email)
		const isValidPass = await bcrypt.compare(
			changeEmailDto.password,
			userFromDb.password
		)
		const isHaveUser = await this.findByEmail(changeEmailDto.newEmail)
		if (isHaveUser) {
			throw new HttpException('USER.EMAIL_ALREDY_EXSIST', HttpStatus.FORBIDDEN)
		}
		if (isValidPass) {
			var accessToken = await this.jwtService.createToken(
				userFromDb.email,
				userFromDb.roles
			)
		} else {
			throw new HttpException(
				'USER.ERROR_CHANGE_EMAIL',
				HttpStatus.UNAUTHORIZED
			)
		}

		userFromDb.email = changeEmailDto.newEmail
		await userFromDb.save()
		return { token: accessToken, user: new UserDto(userFromDb) }
	}

	async changePassword(
		changePasswordDto: ChangePasswordDto,
		headers: HeaderDto
	): Promise<UserUpdateDto> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException('USER.AUTHORIZED_ERROR', HttpStatus.UNAUTHORIZED)
		}
		const decoded = jwt.verify(token, jwtSecretKey)

		const userFromDb = await this.findByEmail(decoded.email)
		const isValidPass = await bcrypt.compare(
			changePasswordDto.currentPassword,
			userFromDb.password
		)

		if (isValidPass) {
			var accessToken = await this.jwtService.createToken(
				userFromDb.email,
				userFromDb.roles
			)
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

		userFromDb.password = changePasswordDto.newPassword
		await userFromDb.save()
		return { token: accessToken, user: new UserDto(userFromDb) }
	}

	// ======== //
	// CONTACTS //
	// ======== //
	async contactRequest(
		requestContact: RequestContactDto,
		headers: HeaderDto
	): Promise<boolean> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'USER.CONTACTS_AUTHORIZED_ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded = jwt.verify(token, jwtSecretKey)
		if (decoded.email != requestContact.email) {
			throw new HttpException(
				'USER.CONTACTS_AUTHORIZED_ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}

		const user = await this.findByEmail(decoded.email)
		const user2 = await this.findByUsername(requestContact.contactUsername)
		if (user2 == null) {
			throw new HttpException(
				'USER.CONTACTS_INCORRENT_USERNAME_REQUEST',
				HttpStatus.BAD_REQUEST
			)
		}

		//  request already send
		if (user.contacts.pending.find(item => item == user2._id) != undefined)
			throw new HttpException(
				'USER.CONTACTS_REQUEST_ALREDY_SEND',
				HttpStatus.OK
			)
		// already in friends
		if (user.contacts.added.find(item => item == user2._id) != undefined)
			throw new HttpException(
				'USER.CONTACTS_REQUEST_ALREDY_SEND',
				HttpStatus.OK
			)

		user.contacts.pending.push(user2._id)
		user2.contacts.requests.push(user._id)
		await user.save()
		await user2.save()

		return true
	}

	async contactAccept(
		acceptContact: AcceptContactDto,
		headers: HeaderDto
	): Promise<boolean> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'USER.CONTACTS_AUTHORIZED_ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded = jwt.verify(token, jwtSecretKey)
		if (decoded.email != acceptContact.email) {
			throw new HttpException(
				'USER.CONTACTS_AUTHORIZED_ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}

		const user = await this.findByEmail(decoded.email)
		const user2 = await this.findByUsername(acceptContact.contactUsername)
		if (user2 == null) {
			throw new HttpException('USER.CONTACTS_ERROR', HttpStatus.BAD_REQUEST)
		}
		if (
			user.contacts.requests.find(item => item == user2.username) == undefined
		)
			throw new HttpException('USER.CONTACTS_ERROR', HttpStatus.OK)

		// user1 delete user2 from pending and request lists
		const index11 = user.contacts.pending.indexOf(user2.username)
		if (index11 !== -1) {
			user.contacts.pending.splice(index11, 1)
		}
		const index12 = user.contacts.pending.indexOf(user2.username)
		if (index12 !== -1) {
			user.contacts.requests.splice(index12, 1)
		}

		// if alredy in friends not will be added again
		if (user.contacts.added.find(item => item == user2.username) == undefined)
			user.contacts.added.push(user2.username)

		// user2 delete user1 from pending and request lists
		const index21 = user2.contacts.pending.indexOf(user.username)
		if (index21 !== -1) {
			user2.contacts.pending.splice(index21, 1)
		}
		const index22 = user.contacts.pending.indexOf(user.username)
		if (index22 !== -1) {
			user2.contacts.requests.splice(index22, 1)
		}

		// if alredy in friends not will be added again
		if (user2.contacts.added.find(item => item == user.username) == undefined)
			user2.contacts.added.push(user.username)

		await user.save()
		await user2.save()

		return true
	}

	async contactReject(
		rejectContact: RejectContactDto,
		headers: HeaderDto
	): Promise<boolean> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'CONTACTS.AUTHORIZED ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded = jwt.verify(token, jwtSecretKey)
		if (decoded.email != rejectContact.email) {
			throw new HttpException(
				'CONTACTS.AUTHORIZED ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}

		const user = await this.findByEmail(decoded.email)
		const user2 = await this.findByUsername(rejectContact.contactUsername)
		if (user2 == null) {
			throw new HttpException(
				'INCORRENT USERNAME REQUEST',
				HttpStatus.BAD_REQUEST
			)
		}

		const index11 = user.contacts.pending.indexOf(user2.username)
		if (index11 !== -1) {
			user.contacts.pending.splice(index11, 1)
		}
		const index12 = user.contacts.pending.indexOf(user2.username)
		if (index12 !== -1) {
			user.contacts.requests.splice(index12, 1)
		}

		const index21 = user2.contacts.pending.indexOf(user.username)
		if (index21 !== -1) {
			user2.contacts.pending.splice(index21, 1)
		}
		const index22 = user.contacts.pending.indexOf(user.username)
		if (index22 !== -1) {
			user2.contacts.requests.splice(index22, 1)
		}
		await user.save()
		await user2.save()

		return true
	}

	async contactDelete(
		contactDto: AcceptContactDto,
		headers: HeaderDto
	): Promise<boolean> {
		// Verify user
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'CONTACTS.AUTHORIZED ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded = jwt.verify(token, jwtSecretKey)
		if (decoded.email != contactDto.email) {
			throw new HttpException(
				'CONTACTS.AUTHORIZED ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}

		const user = await this.findByEmail(decoded.email)
		const user2 = await this.findByUsername(contactDto.contactUsername)
		if (user2 == null) {
			throw new HttpException(
				'INCORRENT USERNAME REQUEST',
				HttpStatus.BAD_REQUEST
			)
		}

		const index11 = user.contacts.added.indexOf(user2.username)
		if (index11 !== -1) {
			user.contacts.added.splice(index11, 1)
		}
		const index21 = user2.contacts.added.indexOf(user.username)
		if (index21 !== -1) {
			user2.contacts.added.splice(index11, 1)
		}

		await user.save()
		await user2.save()

		return true
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
