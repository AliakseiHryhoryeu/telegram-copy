import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	UseInterceptors,
	Param,
	Headers,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { UsersService } from './users.service'
import { IResponse } from '../common/interfaces/response.interface'
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor'
import { TransformInterceptor } from '../common/interceptors/transform.interceptor'
import { HeaderDto } from 'auth/dto/header.dto'
import { UserDto } from './dto/user.dto'
import { ChangePasswordDto } from './dto/change-password'
import { ChangeUsernameDto } from './dto/change-username'
import { ChangeEmailDto } from './dto/change-email'
import { RejectContactDto } from './dto/contacts/reject-contact'
import { RequestContactDto } from './dto/contacts/request-contact'
import { AcceptContactDto } from './dto/contacts/accept-contact'
import { DeleteContactDto } from './dto/contacts/delete-contact'

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/user/:id')
	@UseGuards(RolesGuard)
	@Roles('User')
	async getUserContactsInfo(
		@Body() changePasswordDto: ChangePasswordDto,
		@Headers() headers: HeaderDto
	): Promise<IResponse> {
		try {
			var user = await this.usersService.changePassword(
				changePasswordDto,
				headers
			)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/changePassword')
	@UseGuards(RolesGuard)
	@Roles('User')
	async changePassword(
		@Body() changePasswordDto: ChangePasswordDto,
		@Headers() headers: HeaderDto
	): Promise<IResponse> {
		try {
			var user = await this.usersService.changePassword(
				changePasswordDto,
				headers
			)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/changeUsername')
	@UseGuards(RolesGuard)
	@Roles('User')
	async changeUsername(
		@Body() changeUsernameDto: ChangeUsernameDto,
		@Headers() headers: HeaderDto
	): Promise<IResponse> {
		try {
			const user = await this.usersService.changeUsername(
				changeUsernameDto,
				headers
			)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/changeEmail')
	@UseGuards(RolesGuard)
	@Roles('User')
	async changeEmail(
		@Body() changeEmailDto: ChangeEmailDto,
		@Headers() headers: HeaderDto
	): Promise<IResponse> {
		try {
			var user = await this.usersService.changeEmail(changeEmailDto, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/contacts/request')
	@UseGuards(RolesGuard)
	@Roles('User')
	async requestContact(
		@Body() requestContact: RequestContactDto,
		@Headers() headers: HeaderDto
	): Promise<IResponse> {
		try {
			var user = await this.usersService.contactRequest(requestContact, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/contacts/accept')
	@UseGuards(RolesGuard)
	@Roles('User')
	async acceptContact(
		@Body() acceptContact: AcceptContactDto,
		@Headers() headers: HeaderDto
	): Promise<IResponse> {
		try {
			var user = await this.usersService.contactAccept(acceptContact, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/contacts/reject')
	@UseGuards(RolesGuard)
	@Roles('User')
	async rejectContact(
		@Body() rejectContact: RejectContactDto,
		@Headers() headers: HeaderDto
	): Promise<IResponse> {
		try {
			var user = await this.usersService.contactReject(rejectContact, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/contacts/delete')
	@UseGuards(RolesGuard)
	@Roles('User')
	async deleteContact(
		@Body() deleteContact: DeleteContactDto,
		@Headers() headers: HeaderDto
	): Promise<IResponse> {
		try {
			var user = await this.usersService.contactDelete(deleteContact, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}
}
