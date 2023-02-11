import { UpdateTaskDto } from './dto/update-task.dto'
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
import { DeleteTaskDto } from './dto/delete-task'

const saltRounds = 10
const jwtSecretKey = config.jwt.secretOrKey

@Injectable()
export class TasksService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		@InjectModel('Task') private readonly taskModel: Model<Task>
	) {}

	// async findAllTasks(userid: string): Promise<Task[]> {
	// 	return await this.taskModel.find({ userid: userid }).exec()
	// }
	async findTaskById(taskid: string): Promise<Task> {
		return await this.taskModel.findById(taskid).exec()
	}
	async findUserByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email: email }).exec()
	}
	async findTasksByUserId(userid: string): Promise<Task[]> {
		return await this.taskModel.find({ userid: userid }).exec()
	}
	// async findUserByUsername(username: string): Promise<User> {
	// 	return await this.userModel.findOne({ username: username }).exec()
	// }
	// async findTasksByUsername(username: string): Promise<Task> {
	// 	return await this.taskModel.findOne({ username: username }).exec()
	// }

	//
	//

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

	async readTask(readTaskDto: ReadTaskDto, headers: HeaderDto): Promise<Task> {
		// Verify user
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const decoded = jwt.verify(token, jwtSecretKey)
			const user = await this.findUserByEmail(decoded.email)
			if (!user) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}

			const task = await this.findTaskById(readTaskDto.taskid)
			return task
		} catch (e) {
			console.log(e)
		}
	}

	async readAllTasks(headers: HeaderDto): Promise<Task[]> {
		// Verify user
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const decoded = jwt.verify(token, jwtSecretKey)
			const user = await this.findUserByEmail(decoded.email)
			if (!user) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}

			const tasks = await this.findTasksByUserId(user._id)
			return tasks
		} catch (e) {
			console.log(e)
		}
	}

	async updateTask(
		updateTaskDto: UpdateTaskDto,
		headers: HeaderDto
	): Promise<Task> {
		// Verify user
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const decoded = jwt.verify(token, jwtSecretKey)
			const user = await this.findUserByEmail(decoded.email)
			if (!user) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const task = await this.findTaskById(updateTaskDto.taskid)

			if (updateTaskDto?.title) {
				task.title = updateTaskDto.title
			}
			if (updateTaskDto?.text) {
				task.text = updateTaskDto.text
			}
			if (updateTaskDto?.checked) {
				task.checked = updateTaskDto.checked
			}
			await task.save()
			return task
		} catch (e) {
			console.log(e)
		}
	}

	async deleteTask(
		deleteTaskDto: DeleteTaskDto,
		headers: HeaderDto
	): Promise<Task[]> {
		// Verify user
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const decoded = jwt.verify(token, jwtSecretKey)
			const user = await this.findUserByEmail(decoded.email)
			if (!user) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const task = await this.taskModel.findByIdAndDelete(deleteTaskDto)
			await task.save()

			const tasks = await this.findTasksByUserId(user._id)
			return tasks
		} catch (e) {
			console.log(e)
		}
	}
}
