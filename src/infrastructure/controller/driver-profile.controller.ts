import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { DriverProfileListResponseDto } from '../../application/dto/driver/driver-profile-list-response.dto';
import { DriverProfileResponseDto } from '../../application/dto/driver/driver-profile-response.dto';
import { SetActiveVehicleRequestDto } from '../../application/dto/driver/driver-profile-set-active-vehicle-request.dto';
import { DriverProfileAppService } from '../../application/service/driver-profile.app.service';
import { ActiveRoleEnum } from '../../domain/enums/active-role.enum';
import { Roles } from '../decorator/auth/roles.decorator';

@ApiTags('driver-profile')
@Controller('driver-profile')
@ApiBearerAuth('JWT-auth')
export class DriverProfileController {
  constructor(
    private readonly driverProfileAppService: DriverProfileAppService,
  ) {}

  @ApiOperation({ summary: 'Get all driverProfiles.' })
  @ApiResponse({
    type: DriverProfileListResponseDto,
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
  @Get(':driverId')
  async getDriverProfileById(
    @Req() req: Express.Request,
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
  ) {
    const driverProfile =
      await this.driverProfileAppService.getOneById(driverId);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(driverProfile, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @Roles([ActiveRoleEnum.Onboarding])
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

  @ApiOperation({ summary: 'Set active vehicle for driver.' })
  @ApiResponse({
    type: DriverProfileResponseDto,
    status: HttpStatus.OK,
  })
  @Patch(':driverId/active-vehicle')
  async setActiveVehicle(
    @Req() req: Express.Request,
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
    @Body(new ValidationPipe()) dto: SetActiveVehicleRequestDto,
  ) {
    const updatedDriverProfile =
      await this.driverProfileAppService.setActiveVehicle(driverId, dto);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(updatedDriverProfile, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
