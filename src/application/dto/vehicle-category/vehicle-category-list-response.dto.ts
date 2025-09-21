import { ApiProperty } from '@nestjs/swagger';

import { VehicleCategory } from '../../../domain/entity/vehicle-category.entity';
import { ListResponseDto } from '../list.response.dto';

export class VehicleCategoryListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [VehicleCategory] })
  declare data: VehicleCategory[];
}
