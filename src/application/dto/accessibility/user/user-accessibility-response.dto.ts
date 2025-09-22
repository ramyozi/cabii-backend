import { ApiProperty } from '@nestjs/swagger';

import { UserAccessibility } from '../../../../domain/entity/user-accessibility.entity';
import { BaseResponseDto } from '../../base.response.dto';

export class UserAccessibilityResponseDto extends BaseResponseDto {
  @ApiProperty({ type: UserAccessibility })
  declare data: UserAccessibility;
}
