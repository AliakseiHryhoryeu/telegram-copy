import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import * as _ from 'lodash'

import { Task } from './interfaces/task.interface'
import { User } from '../users/interfaces/user.interface'

import { HeaderDto } from '../auth/dto/header.dto'
import { CreateTaskDto } from './dto/create-task.dto'
import { ReadTaskDto } from './dto/read-task'
import { DeleteTaskDto } from './dto/delete-task'
import { UpdateTaskDto } from './dto/update-task.dto'
import { default as config } from '../config'

const jwtSecretKey = config.jwt.secretOrKey

@Injectable()
export class TasksService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		@InjectModel('Task') private readonly taskModel: Model<Task>
	) {}

	async findTaskById(taskid: string): Promise<Task> {
		return await this.taskModel.findById(taskid).exec()
	}
	async findUserByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email: email }).exec()
	}
	async findTasksByUserId(userid: string): Promise<Task[]> {
		return await this.taskModel.find({ userid: userid }).exec()
	}

	async createTask(taskDto: CreateTaskDto, headers: HeaderDto): Promise<Task> {
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

			const createdTask = new this.taskModel(taskDto)
			createdTask.userid = user._id
			user.tasks.push(createdTask._id)

			await await createdTask.save()
			await await user.save()

			return createdTask
		} catch (e) {
			console.log(e)
		}
	}

	async readTask(readTaskDto: ReadTaskDto, headers: HeaderDto): Promise<Task> {
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR_TOKEN',
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

			await this.taskModel.findByIdAndDelete(deleteTaskDto.taskid)

			const tasks = await this.findTasksByUserId(user._id)
			return tasks
		} catch (e) {
			console.log(e)
		}
	}
}
