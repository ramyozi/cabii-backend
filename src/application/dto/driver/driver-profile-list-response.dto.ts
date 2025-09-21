import { ApiProperty } from '@nestjs/swagger';

import { DriverProfile } from '../../../domain/entity/driver-profile.entity';
import { ListResponseDto } from '../list.response.dto';

export class DriverProfileListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [DriverProfile] })
  data: DriverProfile[];
}
