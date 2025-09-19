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

import { DriverProfileCreateRequestDto } from '../../application/dto/driver/driver-profile-create-request.dto';
import { DriverProfileResponseDto } from '../../application/dto/driver/driver-profile-response.dto';
import { DriverProfileAppService } from '../../application/service/driver-profile.app.service';

@ApiTags('driverProfile')
@Controller('driverProfile')
@ApiBearerAuth('JWT-auth')
export class DriverProfileController {
  constructor(
    private readonly driverProfileAppService: DriverProfileAppService,
  ) {}

  @ApiOperation({ summary: 'Get all driverProfiles.' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get()
  @ApiBearerAuth('JWT-auth')
  async getAllDriverProfiles(@Req() req: Express.Request) {
    const driverProfiles = await this.driverProfileAppService.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(driverProfiles, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Get DriverProfile by id.' })
  @ApiResponse({
    type: DriverProfileResponseDto,
    status: HttpStatus.OK,
    description: 'DriverProfile.',
  })
  @Get(':driverProfileId')
  async getDriverProfileById(
    @Req() req: Express.Request,
    @Param('id') id: string,
  ) {
    const driverProfile = await this.driverProfileAppService.getOneById(id);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(driverProfile, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Create an driverProfile.' })
  @ApiResponse({
    type: DriverProfileResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post()
  async createDriverProfile(
    @Req() req: Request,
    @Body(new ValidationPipe())
    driverProfileCreateDto: DriverProfileCreateRequestDto,
  ) {
    const createdDriverProfile = await this.driverProfileAppService.create(
      driverProfileCreateDto,
    );

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(createdDriverProfile, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
