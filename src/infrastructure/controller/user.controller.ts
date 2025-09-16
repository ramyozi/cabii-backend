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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import Express from 'express';

import { UserCreateRequestDto } from '../../application/dto/user/user-create-request.dto';
import { UserResponseDto } from '../../application/dto/user/user-response.dto';
import { UserAppService } from '../../application/service/user.app.service';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userAppService: UserAppService) {}

  @ApiOperation({ summary: 'Get all users.' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get()
  @ApiBearerAuth('JWT-auth')
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

  @ApiOperation({ summary: 'Get User by id.' })
  @ApiResponse({
    type: UserResponseDto,
    status: HttpStatus.OK,
    description: 'User.',
  })
  @Get(':userId')
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

  @ApiOperation({ summary: 'Create an user.' })
  @ApiResponse({
    type: UserResponseDto,
    status: HttpStatus.CREATED,
  })
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
