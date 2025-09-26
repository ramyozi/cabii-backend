import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID, IsDate, IsNumber } from 'class-validator';

import { ReservationStatusEnum } from '../../../domain/enums/reservation-status.enum';

export class ReservationUpdateRequestDto {
  @ApiProperty({ enum: ReservationStatusEnum, required: false })
  @IsEnum(ReservationStatusEnum)
  @IsOptional()
  status?: ReservationStatusEnum;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  driverId?: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  pickupLat?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  pickupLng?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  dropoffLat?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  dropoffLng?: number;
}
