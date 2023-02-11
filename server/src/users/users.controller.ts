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
	Header,
} from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { UsersService } from './users.service'
import { IResponse } from '../common/interfaces/response.interface'
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor'
import { TransformInterceptor } from '../common/interceptors/transform.interceptor'
import { AuthGuard } from '@nestjs/passport'
import { AcceptContactDto } from './dto/contacts/accept-contact'
import { RejectContactDto } from './dto/contacts/reject-contact'
import { RequestContactDto } from './dto/contacts/request-contact'
// import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('user/:email')
	@UseGuards(RolesGuard)
	@Roles('User')
	async findById(@Param() params): Promise<IResponse> {
		try {
			var user = await this.usersService.findByEmail(params.email)
			return new ResponseSuccess('COMMON.SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error)
		}
	}

	@Post('/contacts/request')
	@UseGuards(RolesGuard)
	@Roles('User')
	async requestContact(
		@Body() contactDto: RequestContactDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var user = await this.usersService.contactRequest(contactDto, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/contacts/accept')
	@UseGuards(RolesGuard)
	@Roles('User')
	async acceptContact(
		@Body() contactDto: RequestContactDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var user = await this.usersService.contactAccept(contactDto, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/contacts/reject')
	@UseGuards(RolesGuard)
	@Roles('User')
	async rejectContact(
		@Body() contactDto: RequestContactDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var user = await this.usersService.contactReject(contactDto, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	@Post('/contacts/delete')
	@UseGuards(RolesGuard)
	@Roles('User')
	async deleteContact(
		@Body() contactDto: RequestContactDto,
		@Headers() headers
	): Promise<IResponse> {
		try {
			var user = await this.usersService.contactDelete(contactDto, headers)
			return new ResponseSuccess('CONTACTS.UPDATE_SUCCESS', new UserDto(user))
		} catch (error) {
			return new ResponseError('CONTACTS.UPDATE_ERROR', error)
		}
	}

	// @Post('profile/update')
	// @UseGuards(RolesGuard)
	// @Roles('User')
	// async updateProfile(@Body() profileDto: ProfileDto): Promise<IResponse> {
	// 	try {
	// 		var user = await this.usersService.updateProfile(profileDto)
	// 		return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(user))
	// 	} catch (error) {
	// 		return new ResponseError('PROFILE.UPDATE_ERROR', error)
	// 	}
	// }

	// @Post('settings/update')
	// @UseGuards(RolesGuard)
	// @Roles('User')
	// async updateSettings(@Body() settingsDto: SettingsDto): Promise<IResponse> {
	// 	try {
	// 		var user = await this.usersService.updateSettings(settingsDto)
	// 		return new ResponseSuccess('SETTINGS.UPDATE_SUCCESS', new UserDto(user))
	// 	} catch (error) {
	// 		return new ResponseError('SETTINGS.UPDATE_ERROR', error)
	// 	}
	// }
}
