import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './interfaces/user.interface'
import { InjectModel } from '@nestjs/mongoose'
// import { UpdateGalleryDto } from './dto/update-gallery.dto'
import * as _ from 'lodash'
import { RequestContactDto } from './dto/contacts/request-contact'
import { HeaderDto } from 'auth/dto/header.dto'
import { default as config } from '../config'
import { AcceptContactDto } from './dto/contacts/accept-contact'

const saltRounds = 10
const jwtSecretKey = config.jwt.secretOrKey
@Injectable()
export class UsersService {
	constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

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

	async contactRequest(
		contactDto: RequestContactDto,
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

		// already request was send
		if (user.contacts.pending.find(item => item == user2.username) != undefined)
			throw new HttpException('User alredy send request', HttpStatus.OK)
		// already in friends
		if (user.contacts.added.find(item => item == user2.username) != undefined)
			throw new HttpException('User alredy send request', HttpStatus.OK)

		user.contacts.pending.push(user2.username)
		user2.contacts.requests.push(user.username)
		await user.save()
		await user2.save()

		return true
	}

	async contactAccept(
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
		if (
			user.contacts.requests.find(item => item == user2.username) == undefined
		)
			throw new HttpException('USER DONT SEND FRIEND REQUEST', HttpStatus.OK)

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

	// async updateProfile(profileDto: ProfileDto): Promise<User> {
	// 	let userFromDb = await this.userModel.findOne({ email: profileDto.email })
	// 	if (!userFromDb)
	// 		throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND)

	// 	// if(profileDto.name) userFromDb.name = profileDto.name;
	// 	// if(profileDto.surname) userFromDb.surname = profileDto.surname;
	// 	// if(profileDto.phone) userFromDb.phone = profileDto.phone;
	// 	// if(profileDto.birthdaydate) userFromDb.birthdaydate = profileDto.birthdaydate;

	// 	await userFromDb.save()
	// 	return userFromDb
	// }

	// async updateSettings(settingsDto: SettingsDto): Promise<User> {
	// 	var userFromDb = await this.userModel.findOne({ email: settingsDto.email })
	// 	if (!userFromDb)
	// 		throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND)

	// 	userFromDb.settings = userFromDb.settings || {}
	// 	for (var key in settingsDto) {
	// 		if (settingsDto.hasOwnProperty(key) && key != 'email') {
	// 			userFromDb.settings[key] = settingsDto[key]
	// 		}
	// 	}

	// 	await userFromDb.save()
	// 	return userFromDb
	// }
}
