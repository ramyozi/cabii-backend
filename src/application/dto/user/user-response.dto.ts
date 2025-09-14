import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../../domain/entity/user.entity';
import { BaseResponseDto } from '../base.response.dto';

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty({ type: User })
  declare data: User;
}
