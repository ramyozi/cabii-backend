import { ApiProperty } from '@nestjs/swagger';

import { Reservation } from '../../../domain/entity/reservation.entity';
import { BaseResponseDto } from '../base.response.dto';

export class ReservationResponseDto extends BaseResponseDto {
  @ApiProperty({ type: Reservation })
  declare data: Reservation;
}
