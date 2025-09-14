import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { UserAppService } from '../../application/service/user.app.service';

@Controller()
export class UserController {
  constructor(private readonly userAppService: UserAppService) {}

  @Get('users')
  async getAllUsers(@Req() req: Request) {
    const users = await this.userAppService.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(users, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
