import { ApiProperty } from '@nestjs/swagger';

import { Vehicle } from '../../../domain/entity/vehicle.entity';
import { BaseResponseDto } from '../base.response.dto';

export class VehicleResponseDto extends BaseResponseDto {
  @ApiProperty({ type: Vehicle })
  declare data: Vehicle;
}
