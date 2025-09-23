import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

import { RidePassengerCreateRequestDto } from '../../application/dto/ride-passenger/ride-passenger-create-request.dto';
import { RidePassengerListResponseDto } from '../../application/dto/ride-passenger/ride-passenger-list-response.dto';
import { RidePassengerResponseDto } from '../../application/dto/ride-passenger/ride-passenger-response.dto';
import { RidePassengerAppService } from '../../application/service/ride-passenger.app.service';

@ApiTags('ride-passenger')
@Controller('ride-passenger')
@ApiBearerAuth('JWT-auth')
export class RidePassengerController {
  constructor(private readonly service: RidePassengerAppService) {}

  @ApiOperation({ summary: 'Add a new passenger to a ride.' })
  @ApiResponse({ type: RidePassengerResponseDto, status: HttpStatus.CREATED })
  @Post()
  async create(@Body(new ValidationPipe()) dto: RidePassengerCreateRequestDto) {
    const passenger = await this.service.create(dto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(passenger, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get ride passenger by ID.' })
  @ApiResponse({ type: RidePassengerResponseDto, status: HttpStatus.OK })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const passenger = await this.service.getById(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(passenger, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'List all ride passengers.' })
  @ApiResponse({ type: RidePassengerListResponseDto, status: HttpStatus.OK })
  @Get()
  async getList() {
    const list = await this.service.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(list, { strategy: 'exposeAll' }),
    };
  }
}
