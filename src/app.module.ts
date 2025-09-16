import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthSessionService } from './application/service/auth-session.service';
import { AuthService } from './application/service/auth.service';
import { UserAppService } from './application/service/user.app.service';
import { UserService } from './domain/service/user.service';
import { appDataSource } from './infrastructure/app-data-source';
import { AuthController } from './infrastructure/controller/auth.controller';
import { UserController } from './infrastructure/controller/user.controller';
import { AuthSessionRepository } from './infrastructure/repository/auth-session.repository';
import { UserRepository } from './infrastructure/repository/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(appDataSource.options),
  ],
  controllers: [
    /* Controller Providers */
    UserController,
    AuthController,
  ],

  providers: [
    /* Domain Service Providers */
    UserService,
    AuthService,
    AuthSessionService,
    /* Repository Providers */
    UserRepository,
    AuthSessionRepository,
    /* App Service Providers */
    UserAppService,
  ],
})
export class AppModule {}
