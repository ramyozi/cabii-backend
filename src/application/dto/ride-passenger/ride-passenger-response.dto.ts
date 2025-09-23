import { ApiProperty } from '@nestjs/swagger';

import { RidePassenger } from '../../../domain/entity/ride-passenger.entity';
import { BaseResponseDto } from '../base.response.dto';

export class RidePassengerResponseDto extends BaseResponseDto {
  @ApiProperty({ type: RidePassenger })
  declare data: RidePassenger;
}
