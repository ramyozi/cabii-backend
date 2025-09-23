import { ApiProperty } from '@nestjs/swagger';

import { Reservation } from '../../../domain/entity/reservation.entity';
import { ListResponseDto } from '../list.response.dto';

export class ReservationListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [Reservation] })
  declare data: Reservation[];
}
