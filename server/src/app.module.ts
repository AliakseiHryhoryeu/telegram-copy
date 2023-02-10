import { TasksModule } from './tasks/tasks.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { default as config } from './config'

const userString =
	config.db.user && config.db.pass
		? config.db.user + ':' + config.db.pass + '@'
		: ''
const authSource = config.db.authSource
	? '?authSource=' + config.db.authSource + '&w=1'
	: ''

@Module({
	imports: [
		MongooseModule.forRoot(
			'mongodb+srv://todo:qpGxkLsRSmFpIvus@cluster0.afohgnu.mongodb.net/?retryWrites=true&w=majority'
		),
		UsersModule,
		AuthModule,
		TasksModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
