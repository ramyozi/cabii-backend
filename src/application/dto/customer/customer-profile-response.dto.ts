import { ApiProperty } from '@nestjs/swagger';

import { CustomerProfile } from '../../../domain/entity/customer-profile.entity';
import { BaseResponseDto } from '../base.response.dto';

export class CustomerProfileResponseDto extends BaseResponseDto {
  @ApiProperty({ type: CustomerProfile })
  declare data: CustomerProfile;
}
