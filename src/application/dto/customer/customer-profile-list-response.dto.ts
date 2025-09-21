import { ApiProperty } from '@nestjs/swagger';

import { CustomerProfile } from '../../../domain/entity/customer-profile.entity';
import { ListResponseDto } from '../list.response.dto';

export class CustomerProfileListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [CustomerProfile] })
  declare data: CustomerProfile[];
}
