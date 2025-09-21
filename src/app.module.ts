import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthSessionService } from './application/service/auth-session.service';
import { AuthService } from './application/service/auth.service';
import { CustomerProfileAppService } from './application/service/customer-profile.app.service';
import { DriverDocumentAppService } from './application/service/driver-document.app.service';
import { DriverProfileAppService } from './application/service/driver-profile.app.service';
import { UserAppService } from './application/service/user.app.service';
import { UserService } from './domain/service/user.service';
import { appDataSource } from './infrastructure/app-data-source';
import { eventEmitterConfig } from './infrastructure/common/event-emitter.config';
import { AuthController } from './infrastructure/controller/auth.controller';
import { CustomerProfileController } from './infrastructure/controller/customer-profile.controller';
import { DriverDocumentController } from './infrastructure/controller/driver-document.controller';
import { DriverProfileController } from './infrastructure/controller/driver-profile.controller';
import { UserController } from './infrastructure/controller/user.controller';
import { AuthSessionRepository } from './infrastructure/repository/auth-session.repository';
import { CustomerProfileRepository } from './infrastructure/repository/customer-profile.repository';
import { DriverDocumentRepository } from './infrastructure/repository/driver-document.repository';
import { DriverProfileRepository } from './infrastructure/repository/driver-profile.repository';
import { UserRepository } from './infrastructure/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(appDataSource.options),
    EventEmitterModule.forRoot(eventEmitterConfig),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    /* Controller Providers */
    UserController,
    CustomerProfileController,
    DriverProfileController,
    AuthController,
    DriverDocumentController,
  ],

  providers: [
    /* Domain Service Providers */
    UserService,
    AuthService,
    AuthSessionService,

    /* Repository Providers */
    UserRepository,
    DriverProfileRepository,
    CustomerProfileRepository,
    AuthSessionRepository,
    DriverDocumentRepository,

    /* App Service Providers */
    UserAppService,
    DriverProfileAppService,
    CustomerProfileAppService,
    DriverDocumentAppService,
  ],
})
export class AppModule {}
