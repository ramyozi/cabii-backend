import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class DriverLocationCreateRequestDto {
  @ApiProperty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNumber()
  lng: number;

  @ApiProperty({ required: false, minimum: 0, maximum: 359 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(359)
  headingDeg?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  speedKph?: number;
}
