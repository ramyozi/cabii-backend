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

import { VehicleCreateRequestDto } from '../../application/dto/vehicle/vehicle-create-request.dto';
import { VehicleListResponseDto } from '../../application/dto/vehicle/vehicle-list-response.dto';
import { VehicleResponseDto } from '../../application/dto/vehicle/vehicle-response.dto';
import { VehicleAppService } from '../../application/service/vehicle.app.service';
import { RoleEnum } from '../../domain/enums/role.enum';
import { Roles } from '../decorator/auth/roles.decorator';

@ApiTags('vehicle')
@Controller('vehicle')
@ApiBearerAuth('JWT-auth')
export class VehicleController {
  constructor(private readonly vehicleAppService: VehicleAppService) {}

  @ApiOperation({ summary: 'Get all vehicles.' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    type: VehicleListResponseDto,
    status: HttpStatus.OK,
  })
  @Roles([RoleEnum.Admin])
  @Get()
  async getAllVehicle(@Req() req: Express.Request) {
    const vehicles = await this.vehicleAppService.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(vehicles, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Get Vehicle by id.' })
  @ApiResponse({
    type: VehicleResponseDto,
    status: HttpStatus.OK,
    description: 'Vehicle.',
  })
  @Get(':vehicleId')
  async getVehicleById(
    @Req() req: Express.Request,
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
  ) {
    const vehicle = await this.vehicleAppService.getOneById(vehicleId);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(vehicle, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Create an vehicle category.' })
  @ApiResponse({
    type: VehicleResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post()
  async createVehicle(
    @Req() req: Request,
    @Body(new ValidationPipe())
    vehicleCreateDto: VehicleCreateRequestDto,
  ) {
    const createdVehicle =
      await this.vehicleAppService.create(vehicleCreateDto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(createdVehicle, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
