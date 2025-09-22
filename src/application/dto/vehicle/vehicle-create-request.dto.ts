import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class VehicleCreateRequestDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  driverId: string;

  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsString()
  plate: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsString()
  chassisNumber: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  categoryId: string;
}
