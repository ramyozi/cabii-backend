import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { ReservationStatusEnum } from '../../../domain/enums/reservation-status.enum';

export class ReservationUpdateStatusRequestDto {
  @ApiProperty({ enum: ReservationStatusEnum })
  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;
}
