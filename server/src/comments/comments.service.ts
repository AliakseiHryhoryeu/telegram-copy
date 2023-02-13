import { Injectable, HttpStatus, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as jwt from 'jsonwebtoken'
import { Model } from 'mongoose'
import * as _ from 'lodash'

import { Task } from './interfaces/comment.interface'
import { User } from '../users/interfaces/user.interface'

import { HeaderDto, IDecodedToken } from '../auth/dto/header.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { ReadCommentDto } from './dto/read-comment'
import { DeleteCommentDto } from './dto/delete-comment'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { default as config } from '../config'

const jwtSecretKey = config.jwt.secretOrKey

@Injectable()
export class CommentsService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		@InjectModel('Task') private readonly taskModel: Model<Task>
	) {}

	async findByUserid(userid: string): Promise<User> {
		return await this.userModel.findOne({ _id: userid }).exec()
	}

	async findAllTasks(userid: string): Promise<Task[]> {
		return await this.taskModel.find({ userid: userid }).exec()
	}
	async findOneTask(taskid: string): Promise<Task> {
		return await this.taskModel.findOne({ _id: taskid }).exec()
	}

	//////////////////////////////////
	async createComment(
		taskDto: CreateCommentDto,
		headers: HeaderDto
	): Promise<Task[]> {
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'TASKS.AUTHORIZED ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)

			const user = await this.findByUserid(decoded._id)
			if (!user) {
				throw new HttpException(
					'TASKS.TOKEN AUTHORIZED ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}

			const createdTask = new this.taskModel(taskDto)
			// createdTask.userid = user._id
			user.tasks.push(createdTask._id)

			await await createdTask.save()
			await await user.save()

			return await this.findAllTasks(user._id)
			// return createdTask
		} catch (e) {
			console.log(e)
		}
	}

	async readAllComments(headers: HeaderDto): Promise<Task[]> {
		try {
			const token = headers.authorization.split(' ')[1]
			if (!token) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)
			const user = await this.findByUserid(decoded._id)
			if (!user) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}

			return await this.readAllComments(user._id)
		} catch (e) {
			console.log(e)
		}
	}

	async updateComment(
		updateTaskDto: UpdateCommentDto,
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
			const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)
			const user = await this.findByUserid(decoded._id)
			if (!user) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}
			const task = await this.findOneTask(updateTaskDto.commentid)

			if (updateTaskDto?.text) {
				task.text = updateTaskDto.text
			}

			await task.save()
			return task
		} catch (e) {
			console.log(e)
		}
	}

	async deleteComment(
		deleteTaskDto: DeleteCommentDto,
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
			const decoded: IDecodedToken = jwt.verify(token, jwtSecretKey)
			const user = await this.findByUserid(decoded._id)
			if (!user) {
				throw new HttpException(
					'TASKS.AUTHORIZED_ERROR',
					HttpStatus.UNAUTHORIZED
				)
			}

			await this.taskModel.findByIdAndDelete(deleteTaskDto.commentid)

			return await this.findAllTasks(user._id)
		} catch (e) {
			console.log(e)
		}
	}
}
