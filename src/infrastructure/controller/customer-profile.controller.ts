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

import { CustomerProfileCreateRequestDto } from '../../application/dto/customer/customer-profile-create-request.dto';
import { CustomerProfileListResponseDto } from '../../application/dto/customer/customer-profile-list-response.dto';
import { CustomerProfileResponseDto } from '../../application/dto/customer/customer-profile-response.dto';
import { CustomerProfileAppService } from '../../application/service/customer-profile.app.service';

@ApiTags('customerProfile')
@Controller('customerProfile')
@ApiBearerAuth('JWT-auth')
export class CustomerProfileController {
  constructor(
    private readonly customerProfileAppService: CustomerProfileAppService,
  ) {}

  @ApiOperation({ summary: 'Get all customerProfiles.' })
  @ApiResponse({
    type: CustomerProfileListResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  @ApiBearerAuth('JWT-auth')
  async getAllCustomerProfiles(@Req() req: Express.Request) {
    const customerProfiles = await this.customerProfileAppService.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(customerProfiles, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Get CustomerProfile by id.' })
  @ApiResponse({
    type: CustomerProfileResponseDto,
    status: HttpStatus.OK,
    description: 'CustomerProfile.',
  })
  @Get(':customerId')
  async getCustomerProfileById(
    @Req() req: Express.Request,
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ) {
    const customerProfile =
      await this.customerProfileAppService.getOneById(customerId);

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(customerProfile, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Create an customerProfile.' })
  @ApiResponse({
    type: CustomerProfileResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post()
  async createCustomerProfile(
    @Req() req: Request,
    @Body(new ValidationPipe())
    customerProfileCreateDto: CustomerProfileCreateRequestDto,
  ) {
    const createdCustomerProfile = await this.customerProfileAppService.create(
      customerProfileCreateDto,
    );

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(createdCustomerProfile, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
