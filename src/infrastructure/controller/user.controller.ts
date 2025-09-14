import { Controller, Get, HttpStatus, Param, Req } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { UserAppService } from '../../application/service/user.app.service';

@Controller()
export class UserController {
  constructor(private readonly userAppService: UserAppService) {}

  @Get('user')
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

  @Get('user/:id')
  async getUserById(@Req() req: Request, @Param('id') id: string) {
    const user = await this.userAppService.getOneById(id);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(user, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
