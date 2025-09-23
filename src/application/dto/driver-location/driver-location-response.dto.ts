import { ApiProperty } from '@nestjs/swagger';

import { DriverLocation } from '../../../domain/entity/driver-location.entity';
import { BaseResponseDto } from '../base.response.dto';

export class DriverLocationResponseDto extends BaseResponseDto {
  @ApiProperty({ type: DriverLocation })
  declare data: DriverLocation;
}
