import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import Express from 'express';

import { UserCreateRequestDto } from '../../application/dto/user/user-create-request.dto';
import { UserAppService } from '../../application/service/user.app.service';

@Controller()
export class UserController {
  constructor(private readonly userAppService: UserAppService) {}

  @Get('user')
  async getAllUsers(@Req() req: Express.Request) {
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
  async getUserById(@Req() req: Express.Request, @Param('id') id: string) {
    const user = await this.userAppService.getOneById(id);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(user, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @Post()
  async createUser(
    @Req() req: Request,
    @Body(new ValidationPipe()) userCreateDto: UserCreateRequestDto,
  ) {
    const createdUser = await this.userAppService.create(userCreateDto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(createdUser, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
