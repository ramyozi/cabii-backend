import { Controller, Get } from '@nestjs/common';

import { UserAppService } from '../../application/service/user.app.service';

@Controller()
export class UserController {
  constructor(private readonly userAppService: UserAppService) {}

  @Get()
  getHello(): string {
    return this.userAppService.getHello();
  }
}
