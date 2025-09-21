import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class VehicleUpdateRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  brand?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  model?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  plate?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  chassisNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
