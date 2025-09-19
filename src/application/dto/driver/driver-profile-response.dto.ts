import { ApiProperty } from '@nestjs/swagger';

import { DriverProfile } from '../../../domain/entity/driver-profile.entity';
import { BaseResponseDto } from '../base.response.dto';

export class DriverProfileResponseDto extends BaseResponseDto {
  @ApiProperty({ type: DriverProfile })
  declare data: DriverProfile;
}
