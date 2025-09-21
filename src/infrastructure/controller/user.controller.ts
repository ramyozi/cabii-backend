import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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

import { EmailAvailibilityCheckRequestDto } from '../../application/dto/user/email-availibility-check-request.dto';
import { PhoneAvailibilityCheckRequestDto } from '../../application/dto/user/phone-availibility-check-request.dto';
import { UserCreateRequestDto } from '../../application/dto/user/user-create-request.dto';
import { UserListResponseDto } from '../../application/dto/user/user-list-response.dto';
import { UserResponseDto } from '../../application/dto/user/user-response.dto';
import { UserAppService } from '../../application/service/user.app.service';
import { RoleEnum } from '../../domain/enums/role.enum';
import { CurrentUserId } from '../decorator/auth/jwt-claim.decorator';
import { Roles } from '../decorator/auth/roles.decorator';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userAppService: UserAppService) {}

  @ApiOperation({ summary: 'Get all users.' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    type: UserListResponseDto,
    status: HttpStatus.OK,
  })
  @Roles([RoleEnum.Admin])
  @Get()
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
  async getUserById(
    @Req() req: Express.Request,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    const user = await this.userAppService.getOneById(userId);

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

  @ApiOperation({ summary: 'Get current User.' })
  @ApiResponse({
    type: UserResponseDto,
    status: HttpStatus.OK,
    description: 'Current User.',
  })
  @Get('me')
  async getMe(
    @Req() req: Request,
    @CurrentUserId(new ParseUUIDPipe()) userId: string,
  ) {
    const user = await this.userAppService.getOneById(userId);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(user, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Check email availability.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email availability.',
  })
  @Get('check-email')
  async checkEmailAvailability(
    @Req() req: Request,
    @Body(new ValidationPipe()) dto: EmailAvailibilityCheckRequestDto,
  ) {
    const isAvailable = await this.userAppService.isEmailAvailable(dto.email);

    return {
      statusCode: HttpStatus.OK,
      message: isAvailable ? 'EMAIL_AVAILABLE' : 'EMAIL_NOT_AVAILABLE',
      data: { isAvailable },
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Phone number availability.',
  })
  @ApiOperation({ summary: 'Check phone number availability.' })
  @Get('check-phone')
  async checkPhoneNumberAvailability(
    @Req() req: Request,
    @Body(new ValidationPipe())
    dto: PhoneAvailibilityCheckRequestDto,
  ) {
    const isAvailable = await this.userAppService.isPhoneNumberAvailable(
      dto.phone,
    );

    return {
      statusCode: HttpStatus.OK,
      message: isAvailable
        ? 'PHONE_NUMBER_AVAILABLE'
        : 'PHONE_NUMBER_NOT_AVAILABLE',
      data: { isAvailable },
    };
  }
}
