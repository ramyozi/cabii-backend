import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { DriverCommissionCreateRequestDto } from '../../application/dto/driver-commission/driver-commission-create-request.dto';
import { DriverCommissionResponseDto } from '../../application/dto/driver-commission/driver-commission-response.dto';
import { DriverCommissionUpdateRequestDto } from '../../application/dto/driver-commission/driver-commission-update-request.dto';
import { DriverCommissionAppService } from '../../application/service/driver-commission.app.service';

@ApiTags('driver-commission')
@Controller('driver/:driverId/commission')
@ApiBearerAuth('JWT-auth')
export class DriverCommissionController {
  constructor(private readonly appService: DriverCommissionAppService) {}

  @ApiOperation({ summary: 'Create a commission for a driver' })
  @ApiResponse({
    type: DriverCommissionResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post()
  async create(
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
    @Body(new ValidationPipe()) dto: DriverCommissionCreateRequestDto,
  ) {
    const commission = await this.appService.create(driverId, dto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(commission, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Update a commission' })
  @ApiResponse({ type: DriverCommissionResponseDto, status: HttpStatus.OK })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: DriverCommissionUpdateRequestDto,
  ) {
    const commission = await this.appService.update(id, dto);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(commission, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get active commission for driver' })
  @ApiResponse({ type: DriverCommissionResponseDto, status: HttpStatus.OK })
  @Get('active')
  async getActive(@Param('driverId', new ParseUUIDPipe()) driverId: string) {
    const commission = await this.appService.getActiveCommission(driverId);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(commission, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get all commissions for driver' })
  @ApiResponse({ type: [DriverCommissionResponseDto], status: HttpStatus.OK })
  @Get()
  async getAll(@Param('driverId', new ParseUUIDPipe()) driverId: string) {
    const list = await this.appService.getAllByDriver(driverId);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(list, { strategy: 'exposeAll' }),
    };
  }
}
