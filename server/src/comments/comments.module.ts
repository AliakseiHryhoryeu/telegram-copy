import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { CommentSchema } from './schemas/comment.schema'
import { LoggerMiddleware } from '../common/middlewares/logger.middleware'
// import { AuthService } from 'auth/auth.service'
// import { JWTService } from 'auth/jwt.service'
// import { JwtStrategy } from 'auth/passport/jwt.strategy'
// import { UsersService } from 'users/users.service'
import { UserSchema } from '../users/schemas/user.schema'
import { UsersService } from '../users/users.service'
import { JwtStrategy } from '../auth/passport/jwt.strategy'
import { JWTService } from '../auth/jwt.service'
import { TaskSchema } from 'tasks/schemas/task.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'User', schema: UserSchema },
			{ name: 'Task', schema: TaskSchema },
			{ name: 'Comment', schema: CommentSchema },
		]),
	],
	controllers: [CommentsController],
	providers: [CommentsService, UsersService, JWTService, JwtStrategy],
	exports: [CommentsService],
})
export class CommentsModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes(CommentsController)
	}
}
