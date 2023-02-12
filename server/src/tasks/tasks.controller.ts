import { DeleteTaskDto } from './dto/delete-task'
import { UpdateTaskDto } from './dto/update-task.dto'
import { CreateTaskDto } from './dto/create-task.dto'
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
} from '@nestjs/common'
import { AllTasksDto, TaskDto } from './dto/task.dto'
import { TasksService } from './tasks.service'
import { IResponse } from '../common/interfaces/response.interface'
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto'
import { Roles } from '../common/decorators/roles.decorator'
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor'
import { TransformInterceptor } from '../common/interceptors/transform.interceptor'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../common/guards/roles.guard'
import { ReadTaskDto } from './dto/read-task'

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get('read')
	@UseGuards(RolesGuard)
	@Roles('User')
	async readTask(
		@Query() readTaskDto: ReadTaskDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var task = await this.tasksService.readTask(readTaskDto, headers)
			return new ResponseSuccess('TASKS.UPDATE_SUCCESS', new TaskDto(task))
		} catch (error) {
			return new ResponseError('TASKS.UPDATE_ERROR', error)
		}
	}
	@Get('readAll')
	@UseGuards(RolesGuard)
	@Roles('User')
	async readAllTasks(@Headers() headers): Promise<IResponse> {
		try {
			var allTasks = await this.tasksService.readAllTasks(headers)
			return new ResponseSuccess(
				'TASKS.READ_ALL_SUCCESS',
				new AllTasksDto(allTasks)
			)
		} catch (error) {
			return new ResponseError('TASKS.READ_ALL_ERROR', error)
		}
	}

	@Post('create')
	@UseGuards(RolesGuard)
	@Roles('User')
	async createTask(
		@Body() createTaskDto: CreateTaskDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var task = await this.tasksService.createTask(createTaskDto, headers)
			return new ResponseSuccess('TASKS.UPDATE_SUCCESS', new TaskDto(task))
		} catch (error) {
			return new ResponseError('TASKS.UPDATE_ERROR', error)
		}
	}
	@Post('update')
	@UseGuards(RolesGuard)
	@Roles('User')
	async updateTask(
		@Body() updateTaskDto: UpdateTaskDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var task = await this.tasksService.updateTask(updateTaskDto, headers)
			return new ResponseSuccess('TASKS.UPDATE_SUCCESS', new TaskDto(task))
		} catch (error) {
			return new ResponseError('TASKS.UPDATE_ERROR', error)
		}
	}

	@Delete('delete')
	@UseGuards(RolesGuard)
	@Roles('User')
	async deleteTask(
		@Body() deleteTaskDto: DeleteTaskDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var task = await this.tasksService.deleteTask(deleteTaskDto, headers)
			return new ResponseSuccess('TASKS.UPDATE_SUCCESS', new AllTasksDto(task))
		} catch (error) {
			return new ResponseError('TASKS.UPDATE_ERROR', error)
		}
	}
}
