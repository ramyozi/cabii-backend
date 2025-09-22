import { ApiProperty } from '@nestjs/swagger';

import { UserAccessibility } from '../../../../domain/entity/user-accessibility.entity';
import { ListResponseDto } from '../../list.response.dto';

export class UserAccessibilityListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [UserAccessibility] })
  declare data: UserAccessibility[];
}
