import { ApiProperty } from '@nestjs/swagger';

import { DriverCommission } from '../../../domain/entity/driver-commission.entity';
import { BaseResponseDto } from '../base.response.dto';

export class DriverCommissionResponseDto extends BaseResponseDto {
  @ApiProperty({ type: DriverCommission })
  declare data: DriverCommission;
}
