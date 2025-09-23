import { ApiProperty } from '@nestjs/swagger';

import { DriverCommission } from '../../../domain/entity/driver-commission.entity';
import { ListResponseDto } from '../list.response.dto';

export class DriverCommissionListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [DriverCommission] })
  declare data: DriverCommission[];
}
