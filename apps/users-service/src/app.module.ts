import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from '@leetcode/database';

@Module({
    imports: [DatabaseModule],
    controllers: [AppController, UsersController],
    providers: [AppService],
})
export class AppModule {}
