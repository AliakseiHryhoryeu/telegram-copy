import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtStrategy } from './passport/jwt.strategy'
import { AuthController } from './auth.controller'
import { UserSchema } from '../users/schemas/user.schema'
import { EmailVerificationSchema } from '../auth/schemas/emailverification.schema'
import { ForgottenPasswordSchema } from './schemas/forgottenpassword.schema'
import { ConsentRegistrySchema } from './schemas/consentregistry.schema'
import { UsersService } from '../users/users.service'
import { JWTService } from './jwt.service'
import { MongooseModule } from '@nestjs/mongoose'
import { LoggerMiddleware } from '../common/middlewares/logger.middleware'
import { HttpModule } from '@nestjs/axios'
import { TaskSchema } from '../tasks/schemas/task.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'User', schema: UserSchema },
			{ name: 'Task', schema: TaskSchema },
			{ name: 'EmailVerification', schema: EmailVerificationSchema },
			{ name: 'ForgottenPassword', schema: ForgottenPasswordSchema },
			{ name: 'ConsentRegistry', schema: ConsentRegistrySchema },
		]),
		HttpModule,
	],
	controllers: [AuthController],
	providers: [AuthService, UsersService, JWTService, JwtStrategy],
})
export class AuthModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerMiddleware)
			// .exclude(
			//   { path: 'example', method: RequestMethod.GET },
			// )
			.forRoutes(AuthController)
	}
}
