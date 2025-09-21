import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

import { DriverDocumentTypeEnum } from '../../../domain/enums/driver-document-type.enum';

export class DriverDocumentCreateRequestDto {
  @ApiProperty()
  @IsString()
  filePath: string;

  @ApiProperty()
  @IsString()
  driverId: string;

  @ApiProperty()
  @IsEnum(DriverDocumentTypeEnum)
  documentType: DriverDocumentTypeEnum;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  expiryDate?: Date;
}
