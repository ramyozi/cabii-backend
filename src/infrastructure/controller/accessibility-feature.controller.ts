import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
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

import { AccessibilityFeatureCreateRequestDto } from '../../application/dto/accessibility/accessibility-feature-create-request.dto';
import { AccessibilityFeatureUpdateRequestDto } from '../../application/dto/accessibility/accessibility-feature-update-request.dto';
import { AccessibilityFeatureAppService } from '../../application/service/accessibility-feature.app.service';
import { AccessibilityFeature } from '../../domain/entity/accessibility-feature.entity';

@ApiTags('accessibility-feature')
@Controller('accessibility-feature')
@ApiBearerAuth('JWT-auth')
export class AccessibilityFeatureController {
  constructor(
    private readonly featureAppService: AccessibilityFeatureAppService,
  ) {}

  @ApiOperation({ summary: 'List all accessibility features' })
  @ApiResponse({ type: [AccessibilityFeature], status: HttpStatus.OK })
  @Get()
  async getAll(@Req() req: Express.Request) {
    const features = await this.featureAppService.getList();

    return {
      statusCode: HttpStatus.OK,
      ...instanceToPlain(features, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Get feature by ID' })
  @ApiResponse({ type: AccessibilityFeature, status: HttpStatus.OK })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const feature = await this.featureAppService.getById(id);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(feature, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Create a new accessibility feature' })
  @ApiResponse({ type: AccessibilityFeature, status: HttpStatus.CREATED })
  @Post()
  async create(
    @Body(new ValidationPipe()) dto: AccessibilityFeatureCreateRequestDto,
  ) {
    const feature = await this.featureAppService.create(dto);

    return {
      statusCode: HttpStatus.CREATED,
      data: instanceToPlain(feature, { strategy: 'exposeAll' }),
    };
  }

  @ApiOperation({ summary: 'Update an accessibility feature' })
  @ApiResponse({ type: AccessibilityFeature, status: HttpStatus.OK })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) dto: AccessibilityFeatureUpdateRequestDto,
  ) {
    const feature = await this.featureAppService.update(id, dto);

    return {
      statusCode: HttpStatus.OK,
      data: instanceToPlain(feature, { strategy: 'exposeAll' }),
    };
  }
}
