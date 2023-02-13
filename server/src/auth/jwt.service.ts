import * as jwt from 'jsonwebtoken'
import { default as config } from '../config'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { User } from '../users/interfaces/user.interface'
import { InjectModel } from '../../node_modules/@nestjs/mongoose'

@Injectable()
export class JWTService {
	constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

	async createToken(_id, roles) {
		const expiresIn = config.jwt.expiresIn,
			secretOrKey = config.jwt.secretOrKey
		const userInfo = { _id: _id, roles: roles }
		const token = jwt.sign(userInfo, secretOrKey, { expiresIn })
		return {
			expires_in: expiresIn,
			access_token: token,
		}
	}

	async validateUser(signedUser): Promise<User> {
		var userFromDb = await this.userModel.findById(signedUser._id)
		if (userFromDb) {
			return userFromDb
		}
		return null
	}
}
