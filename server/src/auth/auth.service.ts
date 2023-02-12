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

const jwtSecretKey = config.jwt.secretOrKey

@Injectable()
export class AuthService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		private readonly jwtService: JWTService
	) {}

	async validateJwt(headers: HeaderDto) {
		const token = headers.authorization.split(' ')[1]
		if (!token) {
			throw new HttpException(
				'CONTACTS.AUTHORIZED ERROR',
				HttpStatus.UNAUTHORIZED
			)
		}
		const decoded = jwt.verify(token, jwtSecretKey)
		var userFromDb = await this.userModel.findOne({ email: decoded.email })

		if (!userFromDb)
			throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.UNAUTHORIZED)

		var accessToken = await this.jwtService.createToken(
			userFromDb.email,
			userFromDb.roles
		)
		return { token: accessToken, user: new UserDto(userFromDb) }
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
				email,
				userFromDb.roles
			)
			return { token: accessToken, user: new UserDto(userFromDb) }
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
