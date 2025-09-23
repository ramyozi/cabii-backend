import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID, IsDate } from 'class-validator';

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
}
