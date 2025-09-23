import { ApiProperty } from '@nestjs/swagger';

import { RidePassenger } from '../../../domain/entity/ride-passenger.entity';
import { ListResponseDto } from '../list.response.dto';

export class RidePassengerListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [RidePassenger] })
  declare data: RidePassenger[];
}
