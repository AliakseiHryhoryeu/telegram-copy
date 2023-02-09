import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './interfaces/user.interface'
import { InjectModel } from '@nestjs/mongoose'
import { ProfileDto } from 'users/dto/profile.dto'
import { SettingsDto } from 'users/dto/settings.dto'
// import { UpdateGalleryDto } from './dto/update-gallery.dto'
import * as _ from 'lodash'

const saltRounds = 10

@Injectable()
export class UsersService {
	constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

	async findAll(): Promise<User[]> {
		return await this.userModel.find().exec()
	}

	async findByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email: email }).exec()
	}

	async createNewUser(newUser: CreateUserDto): Promise<User> {
		if (this.isValidEmail(newUser.email) && newUser.password) {
			var userRegistered = await this.findByEmail(newUser.email)
			if (!userRegistered) {
				newUser.password = await bcrypt.hash(newUser.password, saltRounds)
				var createdUser = new this.userModel(newUser)
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

	isValidEmail(email: string) {
		if (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			return re.test(email)
		} else return false
	}

	async setPassword(email: string, newPassword: string): Promise<boolean> {
		var userFromDb = await this.userModel.findOne({ email: email })
		if (!userFromDb)
			throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND)

		userFromDb.password = await bcrypt.hash(newPassword, saltRounds)

		await userFromDb.save()
		return true
	}

	async updateProfile(profileDto: ProfileDto): Promise<User> {
		let userFromDb = await this.userModel.findOne({ email: profileDto.email })
		if (!userFromDb)
			throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND)

		// if(profileDto.name) userFromDb.name = profileDto.name;
		// if(profileDto.surname) userFromDb.surname = profileDto.surname;
		// if(profileDto.phone) userFromDb.phone = profileDto.phone;
		// if(profileDto.birthdaydate) userFromDb.birthdaydate = profileDto.birthdaydate;

		await userFromDb.save()
		return userFromDb
	}

	async updateSettings(settingsDto: SettingsDto): Promise<User> {
		var userFromDb = await this.userModel.findOne({ email: settingsDto.email })
		if (!userFromDb)
			throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND)

		userFromDb.settings = userFromDb.settings || {}
		for (var key in settingsDto) {
			if (settingsDto.hasOwnProperty(key) && key != 'email') {
				userFromDb.settings[key] = settingsDto[key]
			}
		}

		await userFromDb.save()
		return userFromDb
	}
}
