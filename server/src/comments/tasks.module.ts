import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { TaskSchema } from './schemas/task.schema'
import { LoggerMiddleware } from '../common/middlewares/logger.middleware'
// import { AuthService } from 'auth/auth.service'
// import { JWTService } from 'auth/jwt.service'
// import { JwtStrategy } from 'auth/passport/jwt.strategy'
// import { UsersService } from 'users/users.service'
import { UserSchema } from '../users/schemas/user.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'User', schema: UserSchema },
			{ name: 'Task', schema: TaskSchema },
		]),
	],
	controllers: [TasksController],
	providers: [TasksService],
})
export class TasksModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes(TasksController)
	}
}
