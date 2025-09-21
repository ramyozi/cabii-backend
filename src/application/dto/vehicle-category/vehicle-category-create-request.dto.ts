import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class VehicleCategoryCreateRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 3 })
  costPerKm: number;

  @ApiProperty()
  @IsInt()
  maxPassengers: number;
}
