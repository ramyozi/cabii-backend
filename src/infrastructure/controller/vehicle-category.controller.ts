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

import { VehicleCategoryCreateRequestDto } from '../../application/dto/vehicle-category/vehicle-category-create-request.dto';
import { VehicleCategoryListResponseDto } from '../../application/dto/vehicle-category/vehicle-category-list-response.dto';
import { VehicleCategoryResponseDto } from '../../application/dto/vehicle-category/vehicle-category-response.dto';
import { VehicleCategoryAppService } from '../../application/service/vehicle-category.app.service';

@ApiTags('vehicle-category')
@Controller('vehicle-category')
@ApiBearerAuth('JWT-auth')
export class VehicleCategoryController {
  constructor(
    private readonly vehicleCategoryAppService: VehicleCategoryAppService,
  ) {}

  @ApiOperation({ summary: 'Get all vehicle categories.' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    type: VehicleCategoryListResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  async getAllVehicleCategories(@Req() req: Express.Request) {
    const vehicleCategories = await this.vehicleCategoryAppService.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(vehicleCategories, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Get Vehicle category by id.' })
  @ApiResponse({
    type: VehicleCategoryResponseDto,
    status: HttpStatus.OK,
    description: 'VehicleCategory.',
  })
  @Get(':vehicleCategoryId')
  async getVehicleCategoryById(
    @Req() req: Express.Request,
    @Param('vehicleCategoryId', new ParseUUIDPipe()) vehicleCategoryId: string,
  ) {
    const vehicleCategory =
      await this.vehicleCategoryAppService.getOneById(vehicleCategoryId);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(vehicleCategory, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Create an vehicle category.' })
  @ApiResponse({
    type: VehicleCategoryResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post()
  async createVehicleCategory(
    @Req() req: Request,
    @Body(new ValidationPipe())
    vehicleCategoryCreateDto: VehicleCategoryCreateRequestDto,
  ) {
    const createdVehicleCategory = await this.vehicleCategoryAppService.create(
      vehicleCategoryCreateDto,
    );

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(createdVehicleCategory, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
