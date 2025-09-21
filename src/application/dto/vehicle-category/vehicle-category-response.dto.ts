import { ApiProperty } from '@nestjs/swagger';

import { VehicleCategory } from '../../../domain/entity/vehicle-category.entity';
import { BaseResponseDto } from '../base.response.dto';

export class VehicleCategoryResponseDto extends BaseResponseDto {
  @ApiProperty({ type: VehicleCategory })
  declare data: VehicleCategory;
}
