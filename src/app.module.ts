import { Module } from '@nestjs/common';

import { UserAppService } from './application/service/user.app.service';
import { UserService } from './domain/service/user.service';
import { UserController } from './infrastructure/controller/user.controller';
import { UserRepository } from './infrastructure/repository/user.repository';

@Module({
  imports: [],
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
