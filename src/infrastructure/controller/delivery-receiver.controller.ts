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

import { DeliveryReceiverCreateRequestDto } from '../../application/dto/delivery-receiver/delivery-receiver-create-request.dto';
import { DeliveryReceiverListResponseDto } from '../../application/dto/delivery-receiver/delivery-receiver-list-response.dto';
import { DeliveryReceiverResponseDto } from '../../application/dto/delivery-receiver/delivery-receiver-response.dto';
import { DeliveryReceiverAppService } from '../../application/service/delivery-receiver.app.service';

@ApiTags('delivery-receiver')
@Controller('delivery-receiver')
@ApiBearerAuth('JWT-auth')
export class DeliveryReceiverController {
  constructor(private readonly service: DeliveryReceiverAppService) {}

  @ApiOperation({ summary: 'Create a new delivery receiver.' })
  @ApiResponse({
    type: DeliveryReceiverResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post()
  async create(
    @Body(new ValidationPipe()) dto: DeliveryReceiverCreateRequestDto,
  ) {
    const receiver = await this.service.create(dto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(receiver, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get delivery receiver by ID.' })
  @ApiResponse({ type: DeliveryReceiverResponseDto, status: HttpStatus.OK })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const receiver = await this.service.getById(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(receiver, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'List all delivery receivers.' })
  @ApiResponse({ type: DeliveryReceiverListResponseDto, status: HttpStatus.OK })
  @Get()
  async getList() {
    const list = await this.service.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(list, { strategy: 'exposeAll' }),
    };
  }
}
