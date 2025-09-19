import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DriverProfileCreateRequestDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  driverLicenseSerial: string;
}
