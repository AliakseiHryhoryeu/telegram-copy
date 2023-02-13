import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UserSchema } from './schemas/user.schema'
import { LoggerMiddleware } from '../common/middlewares/logger.middleware'
import { JWTService } from '../auth/jwt.service'
// import { TasksModule } from '../tasks/tasks.module'
// import { TasksService } from '../tasks/tasks.service'
import { TaskSchema } from '../tasks/schemas/task.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'User', schema: UserSchema },
			{ name: 'Task', schema: TaskSchema },
		]),
		// TasksService,
	],
	controllers: [UsersController],
	providers: [UsersService, JWTService],
})
export class UsersModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes(UsersController)
	}
}
