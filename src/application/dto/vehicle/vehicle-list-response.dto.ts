import { ApiProperty } from '@nestjs/swagger';

import { Vehicle } from '../../../domain/entity/vehicle.entity';
import { ListResponseDto } from '../list.response.dto';

export class VehicleListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [Vehicle] })
  declare data: Vehicle[];
}
