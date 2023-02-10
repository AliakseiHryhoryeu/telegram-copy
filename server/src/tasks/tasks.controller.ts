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
	Param,
	Headers,
} from '@nestjs/common'
import { TaskDto } from './dto/task.dto'
import { TasksService } from './tasks.service'
import { IResponse } from '../common/interfaces/response.interface'
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto'
import { Roles } from '../common/decorators/roles.decorator'
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor'
import { TransformInterceptor } from '../common/interceptors/transform.interceptor'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../common/guards/roles.guard'
import { ReadTaskDto } from './dto/read-task'
// import { RolesGuard } from 'common/guards/roles.guard'
// import { UsersService } from 'users/users.service'
// import { UserDto } from 'users/dto/user.dto'
// import { UsersService } from 'users/users.service'
// import { AuthService } from 'auth/auth.service'
// import { ProfileDto } from './dto/profile.dto'
// import { SettingsDto } from './dto/settings.dto'
// import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class TasksController {
	constructor(
		private readonly tasksService: TasksService // private readonly userService: UsersService // private readonly authService: AuthService
	) {}

	// @Get('/')
	// @UseGuards(RolesGuard)
	// @Roles('User')
	// async readAllTasks(@Param() params, @Headers() headers): Promise<IResponse> {
	// 	try {
	// 		var task = await this.usersService.findByEmail(params.email)
	// 		return new ResponseSuccess('COMMON.SUCCESS', new TaskDto(task))
	// 	} catch (error) {
	// 		return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error)
	// 	}
	// }

	@Get('read')
	@UseGuards(RolesGuard)
	@Roles('User')
	async readTask(
		@Param() readTaskDto: ReadTaskDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var task = await this.tasksService.readTask1(readTaskDto, headers)
			return new ResponseSuccess('TASKS.UPDATE_SUCCESS', new TaskDto(task))
		} catch (error) {
			return new ResponseError('TASKS.UPDATE_ERROR', error)
		}
	}
	@Get('readAll')
	@UseGuards(RolesGuard)
	@Roles('User')
	async readAllTasks(
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

	// @Post('update')
	// @UseGuards(RolesGuard)
	// @Roles('User')
	// async updateTask(
	// 	@Body() createTaskDto: CreateTaskDto,
	// 	@Headers() headers
	// ): Promise<IResponse> {
	// 	try {
	// 		var task = await this.tasksService.createTask(createTaskDto, headers)
	// 		return new ResponseSuccess('TASKS.UPDATE_SUCCESS', new TaskDto(task))
	// 	} catch (error) {
	// 		return new ResponseError('TASKS.UPDATE_ERROR', error)
	// 	}
	// }

	// @Post('delete')
	// @UseGuards(RolesGuard)
	// @Roles('User')
	// async deleteTask(
	// 	@Body() createTaskDto: CreateTaskDto,
	// 	@Headers() headers
	// ): Promise<IResponse> {
	// 	try {
	// 		var task = await this.tasksService.createTask(createTaskDto, headers)
	// 		return new ResponseSuccess('TASKS.UPDATE_SUCCESS', new TaskDto(task))
	// 	} catch (error) {
	// 		return new ResponseError('TASKS.UPDATE_ERROR', error)
	// 	}
	// }

	// @Post('/update')
	// @UseGuards(RolesGuard)
	// @Roles('User')
	// async updateTask(
	// 	@Body() taskDto: CreateTaskDto,
	// 	@Headers() headers
	// ): Promise<IResponse> {
	// 	try {
	// 		var user = await this.tasksService.createTask(taskDto, headers)
	// 		return new ResponseSuccess('TASKS.UPDATE_SUCCESS', new UserDto(user))
	// 	} catch (error) {
	// 		return new ResponseError('TASKS.UPDATE_ERROR', error)
	// 	}
	// }
}
