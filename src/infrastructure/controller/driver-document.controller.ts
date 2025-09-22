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
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
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
import { diskStorage } from 'multer';

import { DriverDocumentCreateRequestDto } from '../../application/dto/driver-document/driver-document-create-request.dto';
import { DriverDocumentListResponseDto } from '../../application/dto/driver-document/driver-document-list-response.dto';
import { DriverDocumentResponseDto } from '../../application/dto/driver-document/driver-document-response.dto';
import { DriverDocumentUpdateRequestDto } from '../../application/dto/driver-document/driver-document-update-request.dto';
import { DriverDocumentAppService } from '../../application/service/driver-document.app.service';
import { DriverDocumentTypeEnum } from '../../domain/enums/driver-document-type.enum';

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
        documentType: {
          type: 'string',
          enum: Object.values(DriverDocumentTypeEnum),
        },
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'C:\\files',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + file.originalname.replace(/\s+/g, '_');

          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Multer.File,
    @Body() body: Omit<DriverDocumentCreateRequestDto, 'filePath'>,
  ) {
    const document = await this.driverDocumentAppService.uploadDocument({
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
  @Patch('approve/:documentId')
  async approveDriverDocument(
    @Req() req: Express.Request,
    @Param('documentId', new ParseUUIDPipe()) documentId: string,
  ) {
    const document = this.driverDocumentAppService.approveDocument(documentId);

    return {
      statusCode: HttpStatus.OK,
      message: 'The document has been approved.',
      data: instanceToPlain(document, {
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
  @Patch('deny/:documentId')
  async denyDriverDocument(
    @Req() req: Express.Request,
    @Param('documentId', new ParseUUIDPipe()) documentId: string,
  ) {
    const document = this.driverDocumentAppService.denyDocument(documentId);

    return {
      statusCode: HttpStatus.OK,
      message: 'The document has been denied.',
      data: instanceToPlain(document, {
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
  @Get(':documentId')
  async getDriverDocumentById(
    @Req() req: Express.Request,
    @Param('documentId', new ParseUUIDPipe()) documentId: string,
  ) {
    const document = await this.driverDocumentAppService.getOneById(documentId);

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
  async getDocumentsByDriver(
    @Param('driverId', new ParseUUIDPipe()) driverId: string,
  ) {
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

  @ApiOperation({ summary: 'Update a driver document.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documentType: {
          type: 'string',
          enum: Object.values(DriverDocumentTypeEnum),
        },
        expiryDate: { type: 'string', format: 'date-time' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    type: DriverDocumentResponseDto,
    status: HttpStatus.OK,
    description: 'The document has been updated.',
  })
  @Patch(':documentId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'C:\\files',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + file.originalname.replace(/\s+/g, '_');

          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateDocument(
    @Param('documentId', new ParseUUIDPipe()) documentId: string,
    @UploadedFile() file: Multer.File,
    @Body(new ValidationPipe()) dto: DriverDocumentUpdateRequestDto,
  ) {
    const updatedDoc = await this.driverDocumentAppService.updateDocument(
      documentId,
      dto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'The document has been updated.',
      data: instanceToPlain(updatedDoc, {
        strategy: 'exposeAll',
        groups: ['default'],
      }),
    };
  }
}
