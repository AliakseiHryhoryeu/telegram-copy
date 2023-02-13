import { DeleteCommentDto } from './dto/delete-comment'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import {
	Controller,
	Get,
	Post,
	Body,
	HttpCode,
	HttpStatus,
	UseGuards,
	UseInterceptors,
	Headers,
	Delete,
	Query,
	Injectable,
} from '@nestjs/common'
import { AllCommentsDto, CommentDto } from './dto/comment.dto'
import { CommentsService } from './comments.service'
import { IResponse } from '../common/interfaces/response.interface'
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto'
import { Roles } from '../common/decorators/roles.decorator'
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor'
import { TransformInterceptor } from '../common/interceptors/transform.interceptor'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../common/guards/roles.guard'
import { ReadCommentDto } from './dto/read-comment'

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Get('readAll')
	@UseGuards(RolesGuard)
	@Roles('User')
	async readAllTasks(@Headers() headers): Promise<IResponse> {
		try {
			var response = await this.commentsService.readAllComments(headers)
			return new ResponseSuccess(
				'TASKS.READ_ALL_SUCCESS',
				new AllCommentsDto(response)
			)
		} catch (error) {
			return new ResponseError('TASKS.READ_ALL_ERROR', error)
		}
	}

	@Post('create')
	@UseGuards(RolesGuard)
	@Roles('User')
	async createTask(
		@Body() createCommentDto: CreateCommentDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var comment = await this.commentsService.createComment(
				createCommentDto,
				headers
			)
			return new ResponseSuccess(
				'TASKS.UPDATE_SUCCESS',
				new CommentDto(comment)
			)
		} catch (error) {
			return new ResponseError('TASKS.UPDATE_ERROR', error)
		}
	}
	@Post('update')
	@UseGuards(RolesGuard)
	@Roles('User')
	async updateTask(
		@Body() updateCommentDto: UpdateCommentDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var comment = await this.commentsService.updateComment(
				updateCommentDto,
				headers
			)
			return new ResponseSuccess(
				'TASKS.UPDATE_SUCCESS',
				new CommentDto(comment)
			)
		} catch (error) {
			return new ResponseError('TASKS.UPDATE_ERROR', error)
		}
	}

	@Delete('delete')
	@UseGuards(RolesGuard)
	@Roles('User')
	async deleteTask(
		@Body() deleteCommentDto: DeleteCommentDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var comment = await this.commentsService.deleteComment(
				deleteCommentDto,
				headers
			)
			return new ResponseSuccess(
				'TASKS.UPDATE_SUCCESS',
				new AllCommentsDto(comment)
			)
		} catch (error) {
			return new ResponseError('TASKS.UPDATE_ERROR', error)
		}
	}
}
