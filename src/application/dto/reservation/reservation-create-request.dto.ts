import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { ReservationTypeEnum } from '../../../domain/enums/reservation-type.enum';

export class ReservationCreateRequestDto {
  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  driverId?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({ enum: ReservationTypeEnum })
  @IsEnum(ReservationTypeEnum)
  type: ReservationTypeEnum;

  @ApiProperty()
  @IsNumber()
  pickupLat: number;

  @ApiProperty()
  @IsNumber()
  pickupLng: number;

  @ApiProperty()
  @IsNumber()
  dropoffLat: number;

  @ApiProperty()
  @IsNumber()
  dropoffLng: number;

  @ApiProperty({ required: false })
  @IsOptional()
  scheduledAt?: Date;
}
