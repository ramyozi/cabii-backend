import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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

import { DeliveryObjectCreateRequestDto } from '../../application/dto/delivery-object/delivery-object-create-request.dto';
import { DeliveryObjectListResponseDto } from '../../application/dto/delivery-object/delivery-object-list-response.dto';
import { DeliveryObjectResponseDto } from '../../application/dto/delivery-object/delivery-object-response.dto';
import { DeliveryObjectUpdateRequestDto } from '../../application/dto/delivery-object/delivery-object-update-request.dto';
import { DeliveryObjectAppService } from '../../application/service/delivery-object.app.service';

@ApiTags('delivery-object')
@Controller('delivery-object')
@ApiBearerAuth('JWT-auth')
export class DeliveryObjectController {
  constructor(private readonly service: DeliveryObjectAppService) {}

  @ApiOperation({ summary: 'Create a new delivery object.' })
  @ApiResponse({ type: DeliveryObjectResponseDto, status: HttpStatus.CREATED })
  @Post()
  async create(
    @Body(new ValidationPipe()) dto: DeliveryObjectCreateRequestDto,
  ) {
    const obj = await this.service.create(dto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(obj, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Update delivery object by ID.' })
  @ApiResponse({ type: DeliveryObjectResponseDto, status: HttpStatus.OK })
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: DeliveryObjectUpdateRequestDto,
  ) {
    const obj = await this.service.update(id, dto);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(obj, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get delivery object by ID.' })
  @ApiResponse({ type: DeliveryObjectResponseDto, status: HttpStatus.OK })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const obj = await this.service.getById(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(obj, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'List all delivery objects.' })
  @ApiResponse({ type: DeliveryObjectListResponseDto, status: HttpStatus.OK })
  @Get()
  async getList() {
    const list = await this.service.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(list, { strategy: 'exposeAll' }),
    };
  }
}
