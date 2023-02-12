import {
	Controller,
	Post,
	HttpStatus,
	HttpCode,
	Body,
	Headers,
	Get,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Login } from './interfaces/login.interface'
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto'
import { IResponse } from '../common/interfaces/response.interface'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UserDto } from '../users/dto/user.dto'
import { UsersService } from '../users/users.service'
import { HeaderDto } from './dto/header.dto'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService
	) {}

	@Get('jwt')
	@HttpCode(HttpStatus.OK)
	public async authJwt(@Headers() headers: HeaderDto): Promise<IResponse> {
		try {
			var response = await this.authService.validateJwt(headers)
			return new ResponseSuccess('LOGIN.SUCCESS', response)
		} catch (error) {
			return new ResponseError('LOGIN.ERROR', error)
		}
	}

	@Post('email/login')
	@HttpCode(HttpStatus.OK)
	public async login(@Body() login: Login): Promise<IResponse> {
		try {
			var response = await this.authService.validateLogin(
				login.email,
				login.password
			)
			return new ResponseSuccess('LOGIN.SUCCESS', response)
		} catch (error) {
			return new ResponseError('LOGIN.ERROR', error)
		}
	}

	@Post('email/register')
	@HttpCode(HttpStatus.OK)
	async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
		try {
			var newUser = new UserDto(
				await this.userService.createNewUser(createUserDto)
			)
			return new ResponseSuccess(
				'REGISTRATION.USER_REGISTERED_SUCCESSFULLY',
				newUser
			)
		} catch (error) {
			return new ResponseError('REGISTRATION.ERROR.GENERIC_ERROR', error)
		}
	}
}
