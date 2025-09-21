import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import Express from 'express';
import { Multer } from 'multer';

import { DriverDocumentCreateRequestDto } from '../../application/dto/driver-document/driver-document-create-request.dto';
import { DriverDocumentListResponseDto } from '../../application/dto/driver-document/driver-document-list-response.dto';
import { DriverDocumentResponseDto } from '../../application/dto/driver-document/driver-document-response.dto';
import { DriverDocumentAppService } from '../../application/service/driver-document.app.service';

@ApiTags('driver-document')
@Controller('driver-document')
@ApiBearerAuth('JWT-auth')
export class DriverDocumentController {
  constructor(
    private readonly driverDocumentAppService: DriverDocumentAppService,
  ) {}

  @ApiOperation({ summary: 'Upload a driver document.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        driverId: { type: 'string' },
        documentType: { type: 'string', enum: ['LICENSE', 'INSURANCE', 'ID'] },
        expiryDate: { type: 'string', format: 'date-time' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    type: DriverDocumentResponseDto,
    status: HttpStatus.CREATED,
    description: 'The document has been uploaded.',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Multer.File,
    @Body() body: Omit<DriverDocumentCreateRequestDto, 'filePath'>,
  ) {
    const document = await this.driverDocumentAppService.uplodadDocument({
      ...body,
      filePath: file.path,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'The document has been uploaded.',
      data: instanceToPlain(document, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Approve a driver document by ID.' })
  @ApiResponse({
    type: DriverDocumentResponseDto,
    status: HttpStatus.OK,
    description: 'The document has been approved.',
  })
  @Patch('approve/:id')
  async approveDriverDocument(
    @Req() req: Express.Request,
    @Param('id') id: string,
  ) {
    const document = this.driverDocumentAppService.approveDocument(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'The document has been approved.',
      ...instanceToPlain(document, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Deny a driver document by ID.' })
  @ApiResponse({
    type: DriverDocumentResponseDto,
    status: HttpStatus.OK,
    description: 'The document has been denied.',
  })
  @Patch('deny/:id')
  async denyDriverDocument(
    @Req() req: Express.Request,
    @Param('id') id: string,
  ) {
    const document = this.driverDocumentAppService.denyDocument(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'The document has been denied.',
      ...instanceToPlain(document, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Get a driver document by ID.' })
  @ApiResponse({
    type: DriverDocumentResponseDto,
    status: HttpStatus.OK,
    description: 'The driver document details.',
  })
  @Get(':id')
  async getDriverDocumentById(
    @Req() req: Express.Request,
    @Param('id') id: string,
  ) {
    const document = await this.driverDocumentAppService.getOneById(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Driver document retrieved successfully.',
      data: instanceToPlain(document, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }

  @ApiOperation({ summary: 'Get all documents for a driver.' })
  @ApiResponse({
    type: DriverDocumentListResponseDto,
    status: HttpStatus.OK,
    description: 'List of driver documents.',
  })
  @Get('driver-profile/:driverId')
  async getDocumentsByDriver(@Param('driverId') driverId: string) {
    const documents =
      await this.driverDocumentAppService.getAllByDriverId(driverId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Driver documents retrieved successfully.',
      ...instanceToPlain(documents, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
