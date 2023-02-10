import * as jwt from 'jsonwebtoken'
import mongoose, { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { Task } from './interfaces/task.interface'
import { User } from '../users/interfaces/user.interface'

import { InjectModel } from '@nestjs/mongoose'
// import { ProfileDto } from 'users/dto/profile.dto'
// import { SettingsDto } from 'users/dto/settings.dto'
// import { UpdateGalleryDto } from './dto/update-gallery.dto'
import * as _ from 'lodash'
import { HeaderDto } from '../auth/dto/header.dto'
import { default as config } from '../config'
import { ReadTaskDto } from './dto/read-task'

const saltRounds = 10
const jwtSecretKey = config.jwt.secretOrKey

@Injectable()
export class TasksService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		@InjectModel('Task') private readonly taskModel: Model<Task>
	) {}

	async findAllTasks(userid: string): Promise<Task[]> {
		return await this.taskModel.find({ userid: userid }).exec()
	}
	async findUserByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email: email }).exec()
	}
	async findTasksByEmail(email: string): Promise<Task> {
		return await this.taskModel.findOne({ email: email }).exec()
	}
	async findUserByUsername(username: string): Promise<User> {
		return await this.userModel.findOne({ username: username }).exec()
	}
	async findTasksByUsername(username: string): Promise<Task> {
		return await this.taskModel.findOne({ username: username }).exec()
	}
	async readTask1(readTaskDto: ReadTaskDto, headers: HeaderDto): Promise<Task> {
		// Verify user
		try {
			// console.log(headers)
			// const token = headers.authorization.split(' ')[1]
			// if (!token) {
			// 	throw new HttpException(
			// 		'TASKS.AUTHORIZED ERROR',
			// 		HttpStatus.UNAUTHORIZED
			// 	)
			// }
			// const decoded = jwt.verify(token, jwtSecretKey)

			// const user = await this.findUserByEmail(decoded.email)
			// if (!user) {
			// 	throw new HttpException(
			// 		'TASKS.TOKEN AUTHORIZED ERROR',
			// 		HttpStatus.UNAUTHORIZED
			// 	)
			// }

			// if (decoded.email != readTaskDto.email) {
			// 	throw new HttpException(
			// 		'TASKS.AUTHORIZED ERROR',
			// 		HttpStatus.UNAUTHORIZED
			// 	)
			// }
			console.log(readTaskDto._id)
			// const user = await this.findTasksByUsername(username)
			// const task = await this.taskModel.findById(
			// 	new mongoose.Types.ObjectId(readTaskDto._id)._id
			// )
			// const createdTask = new this.taskModel(readTaskDto)
			// createdTask.userid = user._id
			// createdTask.username = user.username
			// user.tasks.push(createdTask._id)

			// await await createdTask.save()
			// await await user.save()

			return
		} catch (e) {
			console.log(e)
		}
	}

	async createTask(taskDto: CreateTaskDto, headers: HeaderDto): Promise<Task> {
		// Verify user
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'TASKS.AUTHORIZED ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const decoded = jwt.verify(token, jwtSecretKey)

			const user = await this.findUserByEmail(decoded.email)
			if (!user) {
				throw new HttpException(
					'TASKS.TOKEN AUTHORIZED ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			if (decoded.email != taskDto.email) {
				throw new HttpException(
					'TASKS.AUTHORIZED ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}

			const createdTask = new this.taskModel(taskDto)
			createdTask.userid = user._id
			createdTask.username = user.username
			user.tasks.push(createdTask._id)

			await await createdTask.save()
			await await user.save()

			return createdTask
		} catch (e) {
			console.log(e)
		}
	}
}
