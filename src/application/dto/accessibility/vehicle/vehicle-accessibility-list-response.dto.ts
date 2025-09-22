import { ApiProperty } from '@nestjs/swagger';

import { VehicleAccessibility } from '../../../../domain/entity/vehicle-accessibility.entity';
import { ListResponseDto } from '../../list.response.dto';

export class VehicleAccessibilityListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [VehicleAccessibility] })
  declare data: VehicleAccessibility[];
}
