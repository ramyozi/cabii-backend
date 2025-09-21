import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DriverDocumentUpdateRequestDto {
  @ApiProperty({ description: 'New file path for the document' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  filePath?: string;

  @ApiProperty({
    description: 'Optional new expiry date for the document',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  expiryDate?: Date;
}
