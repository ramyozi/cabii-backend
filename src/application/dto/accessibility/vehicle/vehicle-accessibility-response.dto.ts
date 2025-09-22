import { ApiProperty } from '@nestjs/swagger';

import { VehicleAccessibility } from '../../../../domain/entity/vehicle-accessibility.entity';
import { BaseResponseDto } from '../../base.response.dto';

export class VehicleAccessibilityResponseDto extends BaseResponseDto {
  @ApiProperty({ type: VehicleAccessibility })
  declare data: VehicleAccessibility;
}
