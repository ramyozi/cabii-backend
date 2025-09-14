import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAppService } from './application/service/user.app.service';
import { UserService } from './domain/service/user.service';
import { appDataSource } from './infrastructure/app-data-source';
import { UserController } from './infrastructure/controller/user.controller';
import { UserRepository } from './infrastructure/repository/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(appDataSource.options),
  ],
  controllers: [
    /* Controller Providers */
    UserController,
  ],

  providers: [
    /* Domain Service Providers */
    UserService,
    /* Repository Providers */
    UserRepository,
    /* App Service Providers */
    UserAppService,
  ],
})
export class AppModule {}
